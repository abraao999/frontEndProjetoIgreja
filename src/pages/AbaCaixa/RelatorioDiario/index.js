/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaSearch } from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { AiFillPrinter } from 'react-icons/ai';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Container } from '../../../styles/GlobalStyles';
import { Header, Label, Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
import { formataDataInput, getDataDB, getToday } from '../../../util';
// import * as actions from '../../store/modules/auth/actions';

import { Impressao } from '../../../printers/impRelatorioDiario';

export default function RelatorioDiario() {
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [filtro, setFiltro] = useState(false);

  const [valorTotal, setValorTotal] = useState(0);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [dataFiltro, setDataFiltro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      const novaList = [];
      axios.get('/caixa').then(async (dado) => {
        dado.data.map((valor) => {
          const dataOperacao = new Date(valor.data_operacao);

          if (getDataDB(dataOperacao) === getToday()) {
            novaList.push(valor);
          }
        });
        setListMovimentacao(novaList);
        renderizaLista(novaList);
      });
      setIsLoading(false);
    }
    getData();
  }, []);

  const renderizaLista = (list) => {
    let novoValor = 0;
    const novaLista = [];
    list.map((dado) => {
      const data = new Date(dado.data_operacao);
      const dataFormatada = `${data.getDate() + 1}/${data.getMonth() + 1
        }/${data.getFullYear()}`;
      novaLista.push({
        id: dado.id,
        descricao: dado.descricao,
        dataOp: dataFormatada,
        valor: dado.valor,
        tipo: dado.tipo,
        investimento: dado.investimento,
        idDepartamento: dado.departamento_id,
        idSetor: dado.setor_id,
        descDepartamento: dado.desc_departamento,
        descSetor: dado.desc_setor,
      });
      if (dado.tipo) {
        novoValor += dado.valor;
      } else {
        novoValor -= dado.valor;
      }
    });
    setListMovimentacao(novaLista);
    setValorTotal(novoValor);
  };
  const calculaValor = (list) => {
    let novoValor = 0;
    list.map((dado) => {
      if (dado.tipo) {
        novoValor += dado.valor;
      } else {
        novoValor -= dado.valor;
      }
    });
    setValorTotal(novoValor);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];
    axios.get('/caixa').then(async (dado) => {
      dado.data.map((valor) => {
        const dataOperacao = new Date(valor.data_operacao);

        if (formataDataInput(dataFiltro) === getDataDB(dataOperacao)) {
          novaLista.push(valor);
        }
      });
      setListMovimentacao(novaLista);
      renderizaLista(novaLista);
    });

    setIsLoading(false);
  }
  const visualizarImpressao = async () => {
    const novaLista = [];
    listMovimentacao.map((dado) => {
      novaLista.push({
        id: dado.id,
        descricao: dado.descricao,
        dataOp: dado.descricao,
        valor: dado.valor,
        tipo: dado.tipo ? 'Entrada' : 'Saída',
        investimento: dado.investimento ? 'Investimento' : 'Despesa',
        idDepartamento: dado.departamento_id,
        idSetor: dado.setor_id,
        descDepartamento: dado.desc_departamento,
        descSetor: dado.desc_setor,
      });
    });
    const classeImpressao = new Impressao(novaLista, valorTotal);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
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
      await axios.delete(`/caixa/${idParaDelecao}`);
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
        <h2>Relatório diário</h2>
        <button type="button" onClick={visualizarImpressao}>
          <AiFillPrinter size={35} />
        </button>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Data Movimentação:</Form.Label>
            <Form.Control
              id="input"
              type="date"
              value={dataFiltro}
              onChange={(e) => {
                setDataFiltro(e.target.value);
              }}
              placeholder="Nome para filtro"
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="valor">Valor:</Form.Label>
            <Form.Control id="input" type="text" value={valorTotal} disabled />
          </Col>
        </Row>
        <Row>
          {filtro ? (
            <button type="submit">
              Limpar Filtro <FaSearch />
            </button>
          ) : (
            <button type="submit">
              Filtrar <FaSearch />
            </button>
          )}
        </Row>
      </Form>
      <Listagem>
        <h3>Relatório de Movimentação</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">R.F</th>
                <th scope="col">Data</th>
                <th scope="col">Descrição</th>
                <th scope="col">Valor</th>
                <th scope="col">Movimentação</th>
                <th scope="col">Investimento</th>
                <th scope="col">Departamento</th>
                <th scope="col">Congregação</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {listMovimentacao.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.id}</td>
                  <td>{dado.dataOp}</td>
                  <td>{dado.descricao}</td>
                  <td>{dado.valor}</td>
                  <td>{dado.tipo ? 'Entrada' : 'Saída'}</td>
                  <td>{dado.investimento ? 'Investimento' : 'Despesa'}</td>
                  <td>{dado.descDepartamento}</td>
                  <td>{dado.descSetor}</td>

                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(`/caixa/${dado.id}/edit`);
                      }}
                      to={`/caixa/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/relatorioCaixa"
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
