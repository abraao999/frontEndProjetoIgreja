/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import InputMask from "react-input-mask";

import { toast } from "react-toastify";
import { FaArrowRight, FaSave, FaSearch } from "react-icons/fa";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Container } from "../../../styles/GlobalStyles";
import { ContainerBox, Label } from "./styled";
import axios from "../../../services/axios";
import ComboBox from "../../../components/ComboBox";
import Loading from "../../../components/Loading";
// import * as actions from '../../store/modules/auth/actions';

import ModalMembro from "../../../components/ModalMembro";
import { meioPagamento } from "../../../util";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function PedidoLivro({ match }) {
  const id = get(match, "params.id", "");
  const nomeLivro = get(match, "params.nomeLivro", "");
  const [show, setShow] = useState(false);

  const [nomeMembro, setNomeMembro] = useState("");
  const [idMembro, setIdMembro] = useState("");
  const [contato, setContato] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [status, setStatus] = useState("");
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [dataPedido, setDataPedido] = useState("");
  const [membros, setMembros] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      setDescricao(nomeLivro);
      if (id) {
        axios.get(`/livrariaPedido/${id}`).then((response2) => {
          handleEdit(response2.data);
        });
      }
      setIsLoading(false);
    }
    getData();
  }, [id]);
  const limpaCampos = () => {
    setNomeMembro("");
    setIdMembro("");
    setContato("");
    setDescricao("");
    setQuantidade("");
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formErrors = false;

    if (
      descricao.length < 3 ||
      contato.length < 3 ||
      nomeMembro.length < 3 ||
      parseInt(quantidade) <= 0
    ) {
      formErrors = true;
      toast.error("Campo complete todos os campos");
    }
    if (formErrors) return;
    try {
      if (!id) {
        await axios.post("/livrariaPedido", {
          descricao,
          membro_id: idMembro || null,
          contato,
          nome: nomeMembro,
          quantidade: parseInt(quantidade),
          data_pedido: new Date(),
          tipo_pagamento: tipoPagamento || "Pendente",
          status: "PENDENTE",
        });
        limpaCampos();
        toast.success("Pedido criado com sucesso");
        setIsLoading(false);
      } else {
        await axios.put(`/livrariaPedido/${id}`, {
          descricao,
          membro_id: idMembro || null,
          contato,
          nome: nomeMembro,
          quantidade: parseInt(quantidade),
          tipo_pagamento: tipoPagamento || null,
          status,
          data_pedido: dataPedido,
        });
        limpaCampos();
        toast.success("Pedido editado com sucesso");
        setIsLoading(false);
      }
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
  }
  const handleClose = () => {
    setShow(false);
  };
  const handlePesquisaNome = async () => {
    if (nomeMembro.length > 0) {
      try {
        const novaLista = [];
        const response = await axios.get("/membro");
        response.data.map((dados) => {
          if (
            String(dados.nome)
              .toLowerCase()
              .includes(String(nomeMembro.toLowerCase()))
          ) {
            novaLista.push(dados);
          }
        });
        setMembros(novaLista);
        setShow(true);
      } catch (e) {
        toast.error("Condigo não existe");
        console.log(e);
      }
    } else {
      axios.get("/membro").then((response) => {
        setMembros(response.data);
        setShow(true);
      });
    }
  };
  const handleIdMembro = async (idm) => {
    try {
      const response = await axios.get(`/membro/${idm}`);
      setNomeMembro(response.data.nome);
      setIdMembro(response.data.id);
      setContato(response.data.telefone);
      handleClose();
    } catch (e) {
      toast.error("Condigo não existe");
      console.log(e);
    }
  };
  const handleEdit = (dado) => {
    setNomeMembro(dado.nome);
    setIdMembro(dado.membro_id);
    setContato(dado.contato);
    setDescricao(dado.descricao);
    setQuantidade(dado.quantidade);
    setTipoPagamento(dado.tipo_pagamento);
    setDataPedido(dado.data_pedido);
    setStatus(dado.status);
    // history.push(`/classe/${dado.id}/edit`);
  };
  return (
    <Container>
      <h1>Pedido de Livros</h1>
      <Loading isLoading={isLoading} />
      <ModalMembro
        title="Selecione o membro"
        handleClose={handleClose}
        show={show}
        list={membros}
        buttonCancel="Fechar"
        handleIdMembro={handleIdMembro}
      />
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={8} className="my-1">
            <Form.Label htmlFor="descricao">Descrição:</Form.Label>
            <Form.Control
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição"
              maxLength={255}
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Quantidade:</Form.Label>
            <Form.Control
              type="text"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Quantidade"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={10} xs={10} md={8} className="my-1">
            <Form.Label htmlFor="descricao">Nome do Membro</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={nomeMembro}
              onChange={(e) => {
                setNomeMembro(e.target.value);
              }}
              onBlur={() => {
                handlePesquisaNome();
              }}
              placeholder="Nome"
            />
          </Col>
          <Col
            sm={2}
            xs={2}
            md={4}
            className="my-1"
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Button size="lg" onClick={handlePesquisaNome} variant="success">
              <FaSearch size={16} />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={10} xs={10} md={4} className="my-1">
            <Label htmlFor="telefone">
              Celular:
              <InputMask
                mask="(99) 99999-9999"
                id="telefone"
                type="text"
                value={contato}
                onChange={(e) => {
                  setContato(e.target.value);
                  // handleInput(e, 'telefone');
                }}
                placeholder="(00) 00000-0000"
              />
              {/* <small>Insira um número válido</small> */}
            </Label>
          </Col>
          {!nomeLivro && (
            <>
              <Col sm={12} md={4} className="my-1">
                <ComboBox
                  title="Tipo de Pagamento"
                  list={meioPagamento}
                  onChange={(e) => {
                    setTipoPagamento(e.target.value);
                  }}
                  value={tipoPagamento}
                />
              </Col>
            </>
          )}
          <Col
            xs={2}
            sm={2}
            md={1}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Button variant="success" size="lg" type="submit">
              <FaSave size={16} />
            </Button>
          </Col>
          {!nomeLivro && (
            <Col
              sm={2}
              md={3}
              className="my-1"
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <Link to="/listaPedidoLivraria">
                <ContainerBox>
                  <span>Lista de Pedidos</span>
                  <FaArrowRight size={50} color="#198754" />
                </ContainerBox>
              </Link>
            </Col>
          )}
        </Row>
      </Form>
    </Container>
  );
}
PedidoLivro.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
