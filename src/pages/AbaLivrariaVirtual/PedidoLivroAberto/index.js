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
import Loading from "../../../components/Loading";
// import * as actions from '../../store/modules/auth/actions';

import ModalMembro from "../../../components/ModalMembro";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function PedidoLivroAberto({ match }) {
  const id = get(match, "params.id", "");
  const nomeLivro = get(match, "params.nomeLivro", "");
  const [show, setShow] = useState(false);

  const [nomeMembro, setNomeMembro] = useState("");
  const [idMembro, setIdMembro] = useState("");
  const [contato, setContato] = useState("");
  const [email, setEmail] = useState();
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [membros, setMembros] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

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
    setEmail("");
  };
  const sendEmail = async (nReserva) => {
    setIsLoading(true);
    let bodyHtml = "";

    bodyHtml += `
         <div>
         <p><strong>Nº Reserva: </strong><span>${nReserva}</span></p>
         <p><strong>Nome do Livro: </strong><span>${descricao}</span></p>
         <p><strong>Nome Cliente: </strong><span>${nomeMembro}</span></p>
         <p><strong>Telefone: </strong><span>${contato}</span></p>
         <p><strong>E-mail: </strong><span>${email}</span></p>
         </div>`;
    try {
      await axios.post("/sendEmail", {
        bodyHtml,
        email,
      });
      toast.success("E-mail de confirmação enviado com sucesso");
    } catch (error) {
      toast.error("Desculpe mas não foi possível enviar sua solicitaçãos");
    }
    setIsLoading(false);
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
      const response = await axios.post("/livrariaPedido", {
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
      await sendEmail(response.data.id);
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
            </Label>
          </Col>
          <Col sm={10} xs={10} md={4} className="my-1">
            <Form.Label htmlFor="descricao">E-mail</Form.Label>
            <Form.Control
              id="input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Insira o seu e-mail"
            />
          </Col>

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
        </Row>
        <Row style={{ display: "flex", justifyContent: "flex-end" }}>
          <Col sm={2} md={3} className="my-1">
            <Link to="/livrariaVirtual">
              <ContainerBox>
                <span>Livraria Virtual</span>
                <FaArrowRight size={50} color="#198754" />
              </ContainerBox>
            </Link>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
PedidoLivroAberto.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
