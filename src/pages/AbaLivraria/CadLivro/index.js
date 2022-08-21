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

export default function CadLivro({ match }) {
  const id = get(match, "params.id", "");
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState("");
  const [indiceDelecao, setIndiceDelecao] = useState("");

  const [descricao, setDescricao] = useState("");
  const [dataEntrada, setDataEntrada] = useState("");
  const [valor, setValor] = useState("");
  const [custo, setCusto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [listLivro, setListLivro] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get("/livrariaLivro");
      if (id) {
        const response2 = await axios.get(`/livrariaLivro/${id}`);
        setDescricao(response2.data.descricao);
        setCusto(response2.data.custo);
        setValor(response2.data.valor);
        setQuantidade(response2.data.quantidade);
        setDataEntrada(response2.data.data_entrada);
      }
      setListLivro(response.data);

      setIsLoading(false);
    }
    getData();
  }, [id]);
  const limpaCampos = () => {
    setDescricao("");
    setValor("");
    setCusto("");
    setQuantidade("");
    setDataEntrada("");
  };
  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;
    console.log(parseInt(quantidade), quantidade);
    if (
      descricao.length < 3 ||
      descricao.length > 255 ||
      parseFloat(valor) <= 0 ||
      parseFloat(custo) <= 0 ||
      parseInt(quantidade) <= 0
    ) {
      formErrors = true;
      toast.error("Campo descricao deve ter entre 3 e 255 caracteres");
    }
    if (formErrors) return;
    setIsLoading(true);
    try {
      if (!id) {
        const response = await axios.post("/livrariaLivro", {
          descricao,
          data_entrada: dataEntrada,
          custo,
          valor,
          quantidade,
        });
        console.log(response);
        const novaLista = await axios.get("/livrariaLivro");
        setListLivro(novaLista.data);
        limpaCampos();
        toast.success("livro criado com sucesso");

        setIsLoading(false);
      } else {
        const response = await axios.put(`/livrariaLivro/${id}`, {
          descricao,
          data_entrada: dataEntrada,
          custo,
          valor,
          quantidade,
        });
        console.log(response);
        const novaLista = await axios.get("/livrariaLivro");
        setListLivro(novaLista.data);
        limpaCampos();
        history.push("/cadLivro");
        toast.success("livro editado com sucesso");

        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      if (status === 401) {
        toast.error("Voce precisa fazer login");
      } else {
        toast.error("Erro ao alterar o livro");
      }
      setIsLoading(false);
    }
  }
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idLivro, index) => {
    setIdParaDelecao(idLivro);
    setIndiceDelecao(index);
    setShow(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/livrariaLivro/${idParaDelecao}`);
      const novaLista = [...listLivro];
      novaLista.splice(indiceDelecao, 1);
      setListLivro(novaLista);
      toast.success("Livro excluído com sucesso");
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      if (status === 401) {
        toast.error("Voce precisa fazer loggin");
      } else {
        toast.error("Erro ao excluir a o livro");
      }
      setIsLoading(false);
    }
  };
  const calculaValor = (custoLivro) => {
    let aux = parseFloat(custoLivro);
    aux = aux + (aux * 30) / 100;
    setValor(aux);
  };
  return (
    <Container>
      <h1>{id ? "Editar Livro" : "Novo Livro"}</h1>
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
        <Row className="align-items-center">
          <Col sm={12} md={9} className="my-1">
            <Form.Label htmlFor="descricao">Descrição:</Form.Label>

            <Form.Control
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição"
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Data da Aquisição:</Form.Label>

            <Form.Control
              type="date"
              value={dataEntrada}
              onChange={(e) => setDataEntrada(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Custo:</Form.Label>

            <Form.Control
              type="number"
              value={custo}
              onChange={(e) => setCusto(e.target.value)}
              placeholder="Custo"
              onBlur={(e) => calculaValor(e.target.value)}
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Valor:</Form.Label>

            <Form.Control
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Valor"
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Quantidade:</Form.Label>

            <Form.Control
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Quantidade"
            />
          </Col>
          <Col
            sm={12}
            md={3}
            className="my-1"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-start",
            }}
          >
            <Button type="submit" variant="success">
              <FaSave size={24} style={{ marginLeft: 3 }} />
            </Button>
          </Col>
        </Row>
      </Form>
      <Listagem>
        <h3>Lista de Livros</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Descrição</th>
                <th scope="col">Custo</th>
                <th scope="col">Valor</th>
                <th scope="col">Quantidade em Estoque</th>
                <th scope="col">Alterar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {listLivro.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.descricao}</td>
                  <td>R${dado.custo}</td>
                  <td>R${dado.valor}</td>
                  <td>{dado.quantidade}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(`/cadLivro/${dado.id}/edit`);
                      }}
                    >
                      <FaEdit size={16} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleShow(dado.id, index)}
                      to={`/cadLivro/${dado.id}/delete`}
                    >
                      <FaWindowClose size={16} />
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
CadLivro.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
