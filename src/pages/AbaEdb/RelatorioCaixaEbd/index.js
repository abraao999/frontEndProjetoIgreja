/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import moment from "moment";
import "moment/locale/pt-br";
import { get } from "lodash";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { AiFillPrinter } from "react-icons/ai";
import pdfMake from "pdfmake/build/pdfmake";
import { Container } from "../../../styles/GlobalStyles";
import { Header, Label, Listagem } from "./styled";
import axios from "../../../services/axios";
import Modal from "../../../components/Modal";
import Loading from "../../../components/Loading";
import history from "../../../services/history";
import {
  fimPrimeiroTrimestre,
  fimQuartoTrimestre,
  fimSegundoTrimestre,
  fimTerceiroTrimestre,
  inicioPrimeiroTrimestre,
  inicioQuartoTrimestre,
  inicioSegundoTrimestre,
  inicioTerceiroTrimestre,
  trimestres,
} from "../../../util";
// import * as actions from '../../store/modules/auth/actions';

import { Impressao } from "../../../printers/impRelatorioCaixaEbd";
import { useDispatch } from "react-redux";
import * as actions from "../../../store/modules/auth/actions";

export default function RelatorioEbd() {
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState("");
  const [indiceDelecao, setIndiceDelecao] = useState("");

  const [valorTotal, setValorTotal] = useState(0);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [setors, setSetors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [idTrimestre, setIdTrimestre] = useState(0);
  const [idSetor, setIdSetor] = useState(0);
  const dispath = useDispatch();
  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      try {
        const response = await axios.get("/setor");
        setSetors(response.data);
        const response2 = await axios.get("/caixaEbd");
        renderizaLista(response2.data);
      } catch (error) {
        const status = get(error, "response.data.status", 0);
        const msg = get(error, "response.data.erros", 0);
        if (status === 401 || status === 404) {
          toast.error("Voce precisa fazer loggin");
          dispath(actions.loginFailure());
        } else {
          msg.map((dado) => toast.error(dado));
        }
      }

      setIsLoading(false);
    }
    getData();
  }, []);

  const renderizaLista = (list) => {
    let novoValor = 0;
    const novaLista = [];
    list.map((dado) => {
      const dataOp = moment(dado.data_operacao).format("L");

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
    axios.get("/caixaEbd").then((response) => {
      response.data.map((dado) => {
        console.log(dado.data_operacao, dataInicial);
        if (
          dado.data_operacao >= dataInicial &&
          dado.data_operacao <= dataFinal &&
          dado.setor_id === idSetor
        ) {
          novaLista.push(dado);
          console.log("banan");
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
        tipo: dado.tipo ? "Entrada" : "Saída",
        idSetor: dado.setor_id,
        descSetor: dado.desc_setor,
      });
    });
    const classeImpressao = new Impressao(novaLista, valorTotal);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open("", "_blank"));
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
      toast.success("Movimentação excluido com sucesso");

      setIsLoading(false);
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      const msg = get(error, "response.data.erros", 0);
      if (status === 401 || status === 404) {
        toast.error("Voce precisa fazer loggin");
        dispath(actions.loginFailure());
      } else {
        msg.map((dado) => toast.error(dado));
      }
      setShow(false);
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
        <Button variant="success" onClick={visualizarImpressao}>
          <AiFillPrinter size={35} />
        </Button>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={3}>
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
          <Col sm={12} md={3}>
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
          <Col
            sm={12}
            md={3}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Button variant="success" type="submit">
              <FaSearch size={20} />
            </Button>
          </Col>
          <Col sm={12} md={3} hidden={hidden}>
            <Form.Label htmlFor="valor">Valor:</Form.Label>
            <Form.Control id="input" type="text" value={valorTotal} disabled />
          </Col>
        </Row>
        <Row></Row>
      </Form>
      <Listagem hidden={hidden}>
        <h3>Relatório de Movimentação</h3>
        <center>
          <Table
            responsive
            striped
            bordered
            hover
            style={{ textAlign: "center" }}
          >
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
                  <td>R$ {parseFloat(dado.valor).toFixed(2)}</td>
                  <td>{dado.tipo ? "Entrada" : "Saída"}</td>
                  <td>{dado.descSetor}</td>

                  <td>
                    <Button
                      variant="warning"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(`/caixaEbd/${dado.id}/edit`);
                      }}
                    >
                      <FaEdit size={16} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleShow(dado.id, index)}
                    >
                      <FaTrash size={16} />
                    </Button>
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
