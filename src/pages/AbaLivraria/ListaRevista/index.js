/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { toast } from "react-toastify";
import {
  FaEdit,
  FaHourglassHalf,
  FaPrint,
  FaRegEnvelope,
  FaTrash,
} from "react-icons/fa";
import moment from "moment";
import "moment/locale/pt-br";

import { BsCheck, BsCheckAll } from "react-icons/bs";
import { get } from "lodash";
import { Col, Row, Form, Table, Button } from "react-bootstrap";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Container } from "../../../styles/GlobalStyles";
import { LabelSelect, Listagem } from "./styled";
import axios from "../../../services/axios";
import Modal from "../../../components/Modal";
import Loading from "../../../components/Loading";
import history from "../../../services/history";
// import * as actions from '../../store/modules/auth/actions';

import { Impressao } from "../../../printers/impLivrariaListaPedidoRevista";
import { trimestres } from "../../../util";
import { MdClose } from "react-icons/md";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function ListaPedidoRevista({ match }) {
  const id = get(match, "params.id", "");
  const [showDelete, setShowDelete] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState("");
  const [indiceDelecao, setIndiceDelecao] = useState("");
  const [setor, setSetor] = useState("");

  const [trimestre, setTrimestre] = useState("");
  const [filtroTrimestre, setFiltroTrimestre] = useState("");
  const [filtroSetor, setFiltroSetor] = useState("");
  const [filtroClasse, setFiltroClasse] = useState("");

  const [listPedidos, setListPedidos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [classes, setClasses] = useState([]);
  const [listaOriginal, setListaOriginal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get("/livrariaRevista");
      setListPedidos(response.data);
      setListaOriginal(response.data);

      const response2 = await axios.get("/setor");
      setSetores(response2.data);
      const response3 = await axios.get("/classe");
      setClasses(response3.data);
      setIsLoading(false);
    }
    getData();
  }, [id]);

  const handleShow = (idFuncao, index) => {
    setIdParaDelecao(idFuncao);
    setIndiceDelecao(index);
    setShowDelete(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/livrariaPedido/${idParaDelecao}`);
      const novaLista = [...listPedidos];
      novaLista.splice(indiceDelecao, 1);
      setListPedidos(novaLista);
      toast.success("Pedido excluído com sucesso");
      setShowDelete(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      const msg = get(error, "response.data.erros", 0);
      if (status === 401) {
        toast.error("Voce precisa fazer login");
      } else {
        msg.map((dado) => toast.error(dado));
      }
      setIsLoading(false);
    }
  };
  const visualizarImpressao = async () => {
    const classeImpressao = new Impressao(listPedidos);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open("", "_blank"));
  };

  const handleAlteraStatus = async (dado, index) => {
    setIsLoading(true);
    const novaLista = [...listPedidos];
    if (dado.status === "PENDENTE") {
      await axios.put(`/livrariaRevista/${dado.id}`, {
        status: "SOLICITADO",
      });
      novaLista[index] = { ...dado, status: "SOLICITADO" };
      setListPedidos(novaLista);
    } else if (dado.status === "SOLICITADO") {
      await axios.put(`/livrariaRevista/${dado.id}`, {
        status: "ENTREGUE",
      });
      novaLista[index] = { ...dado, status: "ENTREGUE" };
      setListPedidos(novaLista);
    } else if (dado.status === "ENTREGUE") {
      await axios.put(`/livrariaRevista/${dado.id}`, {
        status: "ENTREGUE E PAGO",
      });
      novaLista[index] = { ...dado, status: "ENTREGUE E PAGO" };
      setListPedidos(novaLista);
    }

    setIsLoading(false);
  };
  const handleLimpaFiltro = async () => {
    setListPedidos(listaOriginal);
    setFiltroTrimestre("");
    setFiltroSetor("");
    setFiltroClasse("");
  };

  const carregaFiltros = async (altera, prop) => {
    let aux = [];
    if (altera === "trimestre") {
      console.log(listaOriginal);
      aux = listaOriginal.filter((dado) => {
        if (dado.trimestre === prop) return dado;
      });
    } else if (altera === "setor") {
      console.log(listaOriginal);
      aux = listaOriginal.filter((dado) => {
        if (dado.setor_id === prop) return dado;
      });
    } else if (altera === "classe") {
      console.log(listaOriginal);
      aux = listaOriginal.filter((dado) => {
        if (dado.classe_id === parseInt(prop)) return dado;
      });
    }

    setListPedidos(aux);
  };
  const handleFiltroTrimestre = async (e) => {
    setTrimestre(e);
    const des = e;
    let aux = [];

    if (!filtroTrimestre) {
      aux = listPedidos.filter((dado) => {
        if (dado.trimestre === des) return dado;
      });
      setFiltroTrimestre(e);
      setListPedidos(aux);
    } else {
      setFiltroTrimestre(e);
      carregaFiltros("trimestre", e);
    }
  };
  const handleFiltroSetor = (e) => {
    setSetor(e);
    let aux = [];
    const des = parseInt(e);
    if (!filtroSetor) {
      aux = listPedidos.filter((dado) => {
        if (dado.setor_id === des) return dado;
      });
      setFiltroSetor(des);
      setListPedidos(aux);
    } else {
      setFiltroSetor(des);
      carregaFiltros("setor", des);
    }

    const aux2 = classes.filter((dado) => {
      if (dado.setor_id === des) return dado;
    });

    setClasses(aux2);
  };
  const handleFiltroClasse = (e) => {
    setSetor(e);

    let aux = [];
    if (!filtroClasse) {
      aux = listPedidos.filter((dado) => {
        if (dado.classe_id === parseInt(e)) return dado;
      });
      setFiltroClasse(e);
      setListPedidos(aux);
    } else {
      setFiltroClasse(e);
      carregaFiltros("classe", e);
    }
    setListPedidos(aux);
  };
  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Modal
        title="Atenção!!!"
        handleClose={() => setShowDelete(false)}
        show={showDelete}
        text="Deseja exluir esse registro"
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleFunctionConfirm}
      />

      <Form>
        <Listagem>
          <h3>Lista de Pedido Revista</h3>
          <Button variant="success" onClick={visualizarImpressao} size="lg">
            <FaPrint size={30} />
          </Button>
        </Listagem>

        <Row>
          <Col sm={12} md={3}>
            <LabelSelect>
              Trimestre
              <select
                onChange={(e) => handleFiltroTrimestre(e.target.value)}
                value={trimestre}
              >
                <option value="nada">Selecione o Trimestre</option>
                {trimestres.map((dado) => (
                  <option key={String(dado.id)} value={dado.descricao}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </LabelSelect>
          </Col>
          <Col sm={12} md={3}>
            <LabelSelect htmlFor="cargo">
              Congregação
              <select
                onChange={(e) => handleFiltroSetor(e.target.value)}
                value={setor}
              >
                <option value="nada">Selecione a congregação</option>
                {setores.map((dado) => (
                  <option key={String(dado.id)} value={dado.id}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </LabelSelect>
          </Col>
          <Col sm={12} md={3}>
            <LabelSelect htmlFor="cargo">
              Classe
              <select onChange={(e) => handleFiltroClasse(e.target.value)}>
                <option value="nada">Selecione a classe</option>
                {classes.map((dado) => (
                  <option key={String(dado.id)} value={dado.id}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </LabelSelect>
          </Col>

          <Col
            sm={12}
            md={3}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Button variant="danger" size="lg" onClick={handleLimpaFiltro}>
              <MdClose size={24} />
            </Button>
          </Col>
        </Row>
      </Form>

      <h3>Lista de Pedidos</h3>

      <Table responsive striped bordered hover style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th scope="col">Congregação</th>
            <th scope="col">Classe</th>
            <th scope="col">Trimestre</th>
            <th scope="col">Tipo</th>
            <th scope="col">Quantidade</th>
            <th scope="col">Data</th>
            <th scope="col">Status</th>
            <th scope="col">Alterar</th>
            <th scope="col">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {listPedidos.map((dado, index) => (
            <tr key={String(dado.id)}>
              <td>{dado.desc_setor}</td>
              <td>{dado.desc_classe}</td>
              <td>{dado.trimestre}</td>
              <td>{dado.tipo}</td>
              <td>{dado.quantidade}</td>
              <td>{moment(dado.data_pedido).format("L")}</td>
              <td>
                {dado.status === "PENDENTE" ? (
                  <Button
                    variant="dark"
                    onClick={() => handleAlteraStatus(dado, index)}
                  >
                    <FaHourglassHalf size={16} color="danger" />
                  </Button>
                ) : dado.status === "ENTREGUE" ? (
                  <Button
                    variant="success"
                    onClick={() => handleAlteraStatus(dado, index)}
                  >
                    <BsCheck size={16} />
                  </Button>
                ) : dado.status === "ENTREGUE E PAGO" ? (
                  <Button
                    variant="success"
                    onClick={() => handleAlteraStatus(dado, index)}
                    disabled
                  >
                    <BsCheckAll size={16} />
                  </Button>
                ) : (
                  <Button
                    variant="info"
                    onClick={() => handleAlteraStatus(dado, index)}
                  >
                    <FaRegEnvelope size={16} />
                  </Button>
                )}
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => history.push(`/pedidoLivro/${dado.id}/edit`)}
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
    </Container>
  );
}
ListaPedidoRevista.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
