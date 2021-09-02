/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { AiFillPrinter } from 'react-icons/ai';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaSearch } from 'react-icons/fa';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import { Header, Label, Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
import { Impressao } from '../../../printers/impRelatorioDizimoGeral';
import { getMes } from '../../../util';

export default function RelatorioDizimoGeral() {
  const [show, setShow] = useState(false);

  const [congregacaoId, setCongregacaoId] = useState(
    'Selecione uma congregação'
  );
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  const [setores, setSetores] = useState([]);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [setorSeletected, setSetorSeletected] = useState(0);

  useEffect(() => {
    async function getData() {
      const response = await axios.get('/setor');
      setSetores(response.data);
      const novaLista = [];
      const mes = new Date().getMonth() + 1;
      console.log(mes);
      axios.get(`/dizimo`).then((dado) => {
        dado.data.map((valor) => {
          if (getMes(valor.data_operacao) === mes) novaLista.push(valor);
        });

        renderizaLista(novaLista);
      });
    }
    getData();
  }, []);
  const visualizarImpressao = async () => {
    const classeImpressao = new Impressao(listMovimentacao);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
  };
  const renderizaLista = (list, mes) => {
    const novaLista = [];
    list.map((dado) => {
      const data = new Date(dado.data_operacao);
      const dataFormatada = `${data.getDate()}/${data.getMonth() + 1
        }/${data.getFullYear()}`;
      if (data.getMonth() === mes) {
        novaLista.push({
          id: dado.id,
          nomeMembro: dado.nome,
          setorId: dado.setorId,
          setorDesc: dado.setorDesc,
          dataOp: dataFormatada,
        });
      } else {
        novaLista.push({
          id: dado.id,
          nomeMembro: dado.nome,
          setorId: dado.setorId,
          setorDesc: dado.setorDesc,
          dataOp: dataFormatada,
        });
      }
    });
    setIsLoading(false);
    setListMovimentacao(novaLista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const novaList = [];
    if (dataInicial && dataFinal) {
      axios.get(`/dizimo`).then((dados) => {
        dados.data.map((dado) => {
          console.log(setorSeletected);
          if (
            dado.data_operacao >= dataInicial &&
            dado.data_operacao <= dataFinal &&
            dado.setorDesc === congregacaoId
          ) {
            novaList.push(dado);
          }
        });
        renderizaLista(novaList);
      });
    } else {
      toast.error('Selecione todos os campos para filtrar');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (idFuncao, index) => {
    setIdParaDelecao(idFuncao);
    setIndiceDelecao(index);
    setShow(true);
  };

  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/dizimo/${idParaDelecao}`);
      const novaList = [...listMovimentacao];
      novaList.splice(indiceDelecao, 1);
      setListMovimentacao(novaList);
      toast.success('Movimentação excluido com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir a membro');
      }
      setIsLoading(false);
    }
  };
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);
    setores.map((dado) => {
      if (nome === dado.descricao) setSetorSeletected(dado.id);
    });
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Modal
        title="Atenção!!!"
        handleClose={handleClose}
        show={show}
        text="Deseja exluir esse registro"
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleFunctionConfirm}
      />
      <Header>
        <h1>Relatório de dízimo geral</h1>
        <button type="button" onClick={visualizarImpressao}>
          <AiFillPrinter size={35} />
        </button>
      </Header>
      <Form>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="congregacao">
              Filtrar por congregação
              <select onChange={handleGetIdCongregacao} value={congregacaoId}>
                <option value="nada">Selecione a congregação</option>
                {setores.map((dado) => (
                  <option key={dado.id} value={dado.descricao}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="dataInicial">Data Inicial</Form.Label>
            <Form.Control
              type="date"
              value={dataInicial}
              onChange={(e) => {
                setDataInicial(e.target.value);
              }}
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="dataInicial">Data Final</Form.Label>
            <Form.Control
              type="date"
              value={dataFinal}
              onChange={(e) => {
                setDataFinal(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <button type="submit">
            Filtrar <FaSearch />
          </button>
        </Row>
      </Form>
      <Listagem>
        <h3>Relatório de dizimo</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Nome do Membro</th>
                <th scope="col">Congregação</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {listMovimentacao.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.dataOp}</td>
                  <td>{dado.nomeMembro}</td>
                  <td>{dado.setorDesc}</td>

                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(`/dizimo/${dado.id}/edit`);
                      }}
                      to={`/dizimo/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/relatorioDizimo"
                    >
                      <FaWindowClose size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
    </Container>
  );
}
