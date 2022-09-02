/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/pt-br";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaHourglassHalf,
  FaPrint,
  FaRegEnvelope,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Col, Row, Form, Table, Button, Image } from "react-bootstrap";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Container } from "../../../styles/GlobalStyles";
import { Label, LabelSelect, Listagem } from "./styled";
import axios from "../../../services/axios";
import Modal from "../../../components/Modal";
import ComboBox from "../../../components/ComboBox";
import Loading from "../../../components/Loading";
import history from "../../../services/history";
// import * as actions from '../../store/modules/auth/actions';

import { Impressao } from "../../../printers/impLivrariaLivro";
import ModalMembro from "../../../components/ModalMembro";
import {
  formataDataInput,
  formataDataInputInverso,
  getDataDB,
  imagenVazia,
} from "../../../util";
import { BsCheck, BsCheckAll } from "react-icons/bs";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function Reserva({ match }) {
  const id = get(match, "params.id", "");
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState("");
  const [indiceDelecao, setIndiceDelecao] = useState("");

  const [nomeCliente, setNomeCliente] = useState("");
  const [idMembro, setIdMembro] = useState("");
  const [contato, setContato] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [status, setStatus] = useState("");
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [listPedidos, setListPedidos] = useState([]);
  const [livrosBusca, setLivrosBusca] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get("/livrariaReserva");
      setListPedidos(response.data);
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
      await axios.delete(`/livrariaReserva/${idParaDelecao}`);
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
  const handlePesquisaNome = async () => {
    try {
      const novaLista = [];

      listPedidos.map((dados) => {
        if (
          String(dados.nome_cliente)
            .toLowerCase()
            .includes(String(nomeCliente.toLowerCase()))
        ) {
          novaLista.push(dados);
        }
      });
      setListPedidos(novaLista);
    } catch (e) {
      toast.error("Condigo não existe");
      console.log(e);
    }
  };
  const handleAlteraStatus = async (dado, index) => {
    setIsLoading(true);
    const novaLista = [...listPedidos];
    if (dado.status === "PENDENTE") {
      await axios.put(`/livrariaReserva/${dado.id}`, {
        status: "ENTREGUE",
      });
      history.push(`/venda/${dado.livro_id}/efetivaVenda`);
      novaLista[index] = { ...dado, status: "ENTREGUE" };
      setListPedidos(novaLista);
    }

    setIsLoading(false);
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
          <h3>Livros Reservados</h3>
          <Button variant="success" onClick={visualizarImpressao} size="lg">
            <FaPrint size={30} />
          </Button>
        </Listagem>
        <Row>
          <Col sm={12} md={11} className="my-1">
            <Form.Label htmlFor="descricao">Descricao</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={nomeCliente}
              onChange={(e) => {
                setNomeCliente(e.target.value);
              }}
              onBlur={(e) => {
                handlePesquisaNome();
              }}
              placeholder="Nome"
            />
          </Col>
          <Col
            sm={12}
            md={1}
            className="my-1"
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Button size="lg" onClick={handlePesquisaNome} variant="success">
              <FaSearch size={16} />
            </Button>
          </Col>
        </Row>
      </Form>

      <h3>Lista</h3>

      <Table responsive striped bordered hover style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th scope="col">Descrição</th>
            <th scope="col">Nome Cliente</th>
            <th scope="col">Celular</th>
            <th scope="col">Data da Reserva</th>
            <th scope="col">Status</th>
            <th scope="col">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {listPedidos.map((dado, index) => (
            <tr key={String(dado.id)}>
              <td>{dado.descricao}</td>
              <td>{dado.nome_cliente}</td>
              <td>{dado.celular}</td>
              <td>{moment(dado.data_reserva).format("L")}</td>

              <td>
                {dado.status === "PENDENTE" ? (
                  <Button
                    variant="info"
                    onClick={() => handleAlteraStatus(dado, index)}
                  >
                    <FaHourglassHalf size={16} color="danger" />
                  </Button>
                ) : (
                  dado.status === "ENTREGUE" && (
                    <Button variant="success" disabled>
                      <BsCheck size={16} />
                    </Button>
                  )
                )}
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
Reserva.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
