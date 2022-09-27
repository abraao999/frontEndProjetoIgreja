/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { toast } from "react-toastify";
import { FaArrowRight, FaSave } from "react-icons/fa";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Container } from "../../../styles/GlobalStyles";
import { ContainerBox } from "./styled";
import axios from "../../../services/axios";
import ComboBox from "../../../components/ComboBox";
import Loading from "../../../components/Loading";
// import * as actions from '../../store/modules/auth/actions';

import { listaTipoRevista, trimestres } from "../../../util";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function PedidoRevista({ match }) {
  const id = get(match, "params.id", "");

  const [quantidade, setQuantidade] = useState("");
  const [classe, setClasse] = useState("");
  const [classeId, setClasseId] = useState("");
  const [setor, setSetor] = useState("");
  const [tipoRevista, setTipoRevista] = useState("");
  const [setorId, setSetorId] = useState("");
  const [trimestre, setTrimestre] = useState("");

  const [classes, setClasses] = useState([]);
  const [setores, setSetores] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      const response = await axios.get("/setor");
      setSetores(response.data);

      setIsLoading(false);
    }
    getData();
  }, [id]);
  const limpaCampos = () => {
    setQuantidade("");
    setTipoRevista("");
    setClasse("");
    setSetor("");
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formErrors = false;

    if (!setor || !classe || parseInt(quantidade) <= 0) {
      formErrors = true;
      toast.error("Complete todos os campos");
    }
    if (formErrors) return;
    try {
      if (!id) {
        await axios.post("/livrariaRevista", {
          quantidade: parseInt(quantidade),
          data_pedido: new Date(),
          setor_id: setorId,
          classe_id: classeId,
          tipo: tipoRevista,
          trimestre,
          ano: new Date().getFullYear(),
          status: "PENDENTE",
        });
        limpaCampos();
        toast.success("Pedido criado com sucesso");
        setIsLoading(false);
      } else {
        await axios.put(`/livrariaPedido/${id}`, {
          quantidade: parseInt(quantidade),
          setor_id: setorId,
          classe_id: classeId,
          tipo: tipoRevista,
          trimestre,
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

  const handleIdSetor = async (descricao) => {
    const des = descricao.target.value;
    setIsLoading(true);
    try {
      const response = await axios.get("/setor");
      const d = response.data.find((dado) => dado.descricao === des && dado);
      const response2 = await axios.get("/classe");
      const lista = response2.data.filter((dado) => {
        if (dado.setor_id === d.id) return dado;
      });

      setSetor(d.descricao);
      setSetorId(d.id);
      setClasses(lista);
    } catch (e) {
      toast.error("Condigo não existe");
      console.log(e);
    }
    setIsLoading(false);
  };
  const handleIdClasse = async (descricao) => {
    const des = descricao.target.value;
    setIsLoading(true);
    try {
      const response = await axios.get("/classe");
      const d = response.data.find((dado) => dado.descricao === des && dado);

      setClasse(d.descricao);
      setClasseId(d.id);
    } catch (e) {
      toast.error("Condigo não existe");
      console.log(e);
    }
    setIsLoading(false);
  };
  // const handleEdit = (dado) => {
  //   setNomeMembro(dado.nome);
  //   setIdMembro(dado.membro_id);
  //   setContato(dado.contato);
  //   setDescricao(dado.descricao);
  //   setQuantidade(dado.quantidade);
  //   setTipoPagamento(dado.tipo_pagamento);
  //   setDataPedido(dado.data_pedido);
  //   setStatus(dado.status);
  //   // history.push(`/classe/${dado.id}/edit`);
  // };
  return (
    <Container>
      <h1>Pedido de Revista</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={3}>
            <ComboBox
              title="Selecione a congregação"
              onChange={handleIdSetor}
              list={setores}
              value={setor}
            />
          </Col>
          <Col sm={12} md={3}>
            <ComboBox
              title="Selecione a classe"
              list={classes}
              value={classe}
              onChange={handleIdClasse}
            />
          </Col>
          <Col sm={12} md={3}>
            <ComboBox
              title="Selecione o trimestre"
              list={trimestres}
              value={trimestre}
              onChange={(e) => setTrimestre(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={3}>
            <ComboBox
              title="Selecione o itpo"
              list={listaTipoRevista}
              value={tipoRevista}
              onChange={(e) => setTipoRevista(e.target.value)}
            />
          </Col>
          <Col sm={12} md={3}>
            <Form.Label htmlFor="descricao">Quantidade</Form.Label>
            <Form.Control
              id="input"
              type="number"
              value={quantidade}
              onChange={(e) => {
                setQuantidade(e.target.value);
              }}
              placeholder="Quantidade"
            />
          </Col>
          <Col
            sm={2}
            xs={2}
            md={3}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Button size="lg" onClick={handleSubmit} variant="success">
              <FaSave size={16} />
            </Button>
          </Col>
        </Row>

        <Row
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Col sm={2} md={3}>
            <Link to="/listaPedidoLivraria">
              <ContainerBox>
                <span>Lista de Pedidos</span>
                <FaArrowRight size={50} color="#198754" />
              </ContainerBox>
            </Link>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
PedidoRevista.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
