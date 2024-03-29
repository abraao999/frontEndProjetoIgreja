/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { toast } from "react-toastify";
import { FaEdit, FaSave, FaWindowClose } from "react-icons/fa";
import { get } from "lodash";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { Container } from "../../../styles/GlobalStyles";
import Modal from "../../../components/Modal";

import { Listagem } from "./styled";
import axios from "../../../services/axios";

import Loading from "../../../components/Loading";
import history from "../../../services/history";
// import * as actions from '../../store/modules/auth/actions';

export default function Cargo({ match }) {
  const id = get(match, "params.id", "");
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState("");
  const [indiceDelecao, setIndiceDelecao] = useState("");

  const [descricao, setDescricao] = useState("");
  const [descricaoList, setDescricaoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get("/cargo");
      console.log(response.data);
      setDescricaoList(response.data);
      // if(idFuncao){

      // }
      setIsLoading(false);
    }
    getData();
  }, [id]);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formErrors = false;

    if (descricao.length < 3 || descricao.length > 255) {
      formErrors = true;
      toast.error("Campo descricao deve ter entre 3 e 255 caracteres");
    }
    if (formErrors) return;
    try {
      if (!id) {
        const response = await axios.post("/cargo", { descricao });
        console.log(response);
        const novaLista = await axios.get("/cargo");
        setDescricaoList(novaLista.data);
        setDescricao("");
        toast.success("Cargo criada com sucesso");

        setIsLoading(false);
      } else {
        const response = await axios.put(`/cargo/${id}`, { descricao });
        console.log(response);
        const novaLista = await axios.get("/cargo");
        setDescricaoList(novaLista.data);
        setDescricao("");
        toast.success("Cargo editado com sucesso");

        history.push("/cargo");
        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      if (status === 401) {
        toast.error("Voce precisa fazer loggin");
      } else {
        toast.error("Erro ao excluir um aluno");
      }
      setIsLoading(false);
    }
  }
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
      await axios.delete(`/cargo/${idParaDelecao}`);
      const novosFuncoes = [...descricaoList];
      novosFuncoes.splice(indiceDelecao, 1);
      setDescricaoList(novosFuncoes);
      toast.success("Cargo excluida com sucesso");
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      if (status === 401) {
        toast.error("Voce precisa fazer loggin");
      } else {
        toast.error("Erro ao excluir a classe");
      }
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <h1>{id ? "Editar Cargo" : "Novo Cargo"}</h1>
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
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={10} md={10}>
            <Form.Label htmlFor="descricao">Nome da cargo:</Form.Label>

            <Form.Control
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Cargo"
            />
          </Col>
          <Col
            sm={2}
            md={2}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Button variant="success" type="submit">
              <FaSave size={16} />
            </Button>
          </Col>
        </Row>
      </Form>
      <Listagem>
        <h3>Lista de Cargos</h3>

        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th scope="col">Descição</th>
              <th scope="col">Alterar</th>
              <th scope="col">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {descricaoList.map((dado, index) => (
              <tr key={String(dado.id)}>
                <td>{dado.descricao}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={(e) => {
                      e.preventDefault();
                      setDescricao(dado.descricao);
                      history.push(`/cargo/${dado.id}/edit`);
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
                    <FaWindowClose size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Listagem>
    </Container>
  );
}
Cargo.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
