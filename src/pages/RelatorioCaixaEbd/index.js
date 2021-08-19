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
import { Container } from '../../styles/GlobalStyles';
import { Header, Label, Listagem } from './styled';
import axios from '../../services/axios';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import history from '../../services/history';
import {
  formataDataInput,
  getDataDB,
  getToday,
  fimPrimeiroTrimestre,
  fimQuartoTrimestre,
  fimSegundoTrimestre,
  fimTerceiroTrimestre,
  inicioPrimeiroTrimestre,
  inicioQuartoTrimestre,
  inicioSegundoTrimestre,
  inicioTerceiroTrimestre,
  trimestres,
} from '../../util';
// import * as actions from '../../store/modules/auth/actions';

import { Impressao } from '../../printers/impRelatorioDiario';

export default function RelatorioEbd() {
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [filtro, setFiltro] = useState(false);

  const [valorTotal, setValorTotal] = useState(0);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [setors, setSetors] = useState([]);
  const [dataFiltro, setDataFiltro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [idTrimestre, setIdTrimestre] = useState(0);
  const [idSetor, setIdSetor] = useState(0);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      const response = await axios.get('/setor');
      setSetors(response.data);

      setIsLoading(false);
    }
    getData();
  }, []);

  const renderizaLista = (list) => {
    let novoValor = 0;
    const novaLista = [];
    list.map((dado) => {
      const dataOp = getDataDB(new Date(dado.data_operacao));

      novaLista.push({
        id: dado.id,
        descricao: dado.descricao,
        dataOp,
        valor: dado.valor,
        tipo: dado.tipo,
        idSetor: dado.setor_id,
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
  const handleIdTrimestre = async (e) => {
    const valor = Number(e.target.value);

    setIdTrimestre(valor);
    console.log(valor);
  };
  const handleIdSetor = async (e) => {
    const valor = Number(e.target.value);

    setIdSetor(valor);
    console.log(valor);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];

    let dataInicial;
    let dataFinal;
    switch (idTrimestre) {
      case 0: {
        dataInicial = inicioPrimeiroTrimestre;
        dataFinal = fimPrimeiroTrimestre;

        break;
      }
      case 1: {
        dataInicial = inicioSegundoTrimestre;
        dataFinal = fimSegundoTrimestre;

        break;
      }
      case 2: {
        dataInicial = inicioTerceiroTrimestre;
        dataFinal = fimTerceiroTrimestre;

        break;
      }
      case 3: {
        dataInicial = inicioQuartoTrimestre;
        dataFinal = fimQuartoTrimestre;

        break;
      }

      default:
        break;
    }
    axios.get('/caixaEbd').then((response) => {
      response.data.map((dado) => {
        console.log(dado.data_operacao, dataInicial);
        if (
          dado.data_operacao >= dataInicial &&
          dado.data_operacao <= dataFinal &&
          dado.setor_id === idSetor
        ) {
          novaLista.push(dado);
          console.log('banan');
        }
      });
      renderizaLista(novaLista);
    });
    setHidden(false);
    setIsLoading(false);
  }
  const visualizarImpressao = async () => {
    const novaLista = [];
    listMovimentacao.map((dado) => {
      novaLista.push({
        id: dado.id,
        descricao: dado.descricao,
        dataOp: dado.dataOp,
        valor: dado.valor,
        tipo: dado.tipo ? 'Entrada' : 'Saída',
        idSetor: dado.setor_id,
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
      await axios.delete(`/caixaEbd/${idParaDelecao}`);
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
        <h2>Relatório Caixa EBD</h2>
        <button type="button" onClick={visualizarImpressao}>
          <AiFillPrinter size={35} />
        </button>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="departamento">
              Selecione o trimestre
              <select onChange={handleIdTrimestre}>
                <option value="nada">Selecione o trimestre</option>
                {trimestres.map((dado) => (
                  <option key={dado.id} value={dado.id}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="departamento">
              Selecione a congregação
              <select onChange={handleIdSetor}>
                <option value="nada">Selecione a congregação</option>
                {setors.map((dado) => (
                  <option key={dado.id} value={dado.id}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1" hidden={hidden}>
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
      <Listagem hidden={hidden}>
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
                  <td>{dado.descSetor}</td>

                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(`/caixaEbd/${dado.id}/edit`);
                      }}
                      to={`/caixaEbd/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/relatorioCaixaEbd"
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
