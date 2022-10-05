/* eslint-disable react/prop-types */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import {
  FaCamera,
  FaEdit,
  FaRegListAlt,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { imagenVazia } from "../../../util";

import { get } from "lodash";
import { Row, Form, Table, Col, Button, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Container } from "../../../styles/GlobalStyles";
import { Listagem, Label } from "./styled";
import axios from "../../../services/axios";
import Modal from "../../../components/Modal";
import Loading from "../../../components/Loading";
import history from "../../../services/history";

export default function ListAluno() {
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState("");
  const [indiceDelecao, setIndiceDelecao] = useState("");
  const [filtro, setFiltro] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classeSeletected, setClasseSeletected] = useState(0);
  const [congregacaoId, setCongregacaoId] = useState(
    "Selecione uma congregação"
  );

  const [aluno, setAluno] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dataStorage = useSelector((state) => state.auth);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const lista = [];
      axios.get("/classe").then((res) => {
        res.data.map((valor) => {
          if (dataStorage.user.setor_id === valor.setor_id) {
            lista.push(valor);
          }
        });

        setClasses(lista);
      });
      const listaAluno = [];
      axios.get("/aluno").then((res) => {
        console.log(res.data, dataStorage.user.setor_id);
        res.data.map((valor) => {
          if (dataStorage.user.setor_id === valor.setor_id) {
            listaAluno.push(valor);
          }
        });
        console.log(listaAluno);
        renderizaLista(listaAluno);
      });
      setIsLoading(false);
    }
    getData();
  }, []);
  const renderizaLista = async (lista) => {
    const aux = [...lista];
    const novaLista = [];
    const response = await axios.get("/ebdFoto");
    aux.map((dado) => {
      let pula = false;
      response.data.map((foto) => {
        if (dado.foto_id === foto.id) {
          novaLista.push({ ...dado, url: foto.url });
          pula = true;
        }
      });
      if (!pula) novaLista.push({ ...dado, url: imagenVazia });
    });
    setAluno(novaLista);
    console.log(novaLista);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];
    if (descricao.length > 1) {
      aluno.map((dados) => {
        if (String(dados.nome).toLowerCase().includes(String(descricao))) {
          novaLista.push(dados);
        }
      });
    } else {
      console.log(aluno);
      if (!filtro) {
        aluno.map((dados) => {
          if (dados.classe_id === classeSeletected) {
            novaLista.push(dados);
          }
        });
        setFiltro(true);
      } else {
        const response = await axios.get("/aluno");
        response.data.map((dados) => {
          if (dados.classe_id === classeSeletected) {
            novaLista.push(dados);
          }
        });
      }
    }
    setAluno(novaLista);
    setIsLoading(false);
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
      await axios.delete(`/aluno/${idParaDelecao}`);
      const novaList = [...aluno];
      novaList.splice(indiceDelecao, 1);
      setAluno(novaList);
      toast.success("Aluno excluido com sucesso");
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      if (status === 401) {
        toast.error("Voce precisa fazer loggin");
      } else {
        toast.error("Erro ao excluir um aluno");
      }
      setIsLoading(false);
    }
  };
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);

    classes.map((dado) => {
      if (nome === dado.descricao) setClasseSeletected(dado.id);
    });
  };
  return (
    <Container>
      <h1>Lista de Alunos</h1>
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
          <Col sm={12} md={5}>
            <Form.Label htmlFor="descricao">
              Insira um nome para filtrar:
            </Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
              }}
              placeholder="Nome para filtro"
            />
          </Col>
          <Col sm={12} md={5}>
            <Label htmlFor="congregacao">
              Filtrar por classe
              <select onChange={handleGetIdCongregacao} value={congregacaoId}>
                <option value="nada">Selecione a classe</option>
                {classes.map((dado) => (
                  <option key={dado.id} value={dado.descricao}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col md={2} style={{ display: "flex", alignItems: "flex-end" }}>
            <Button variant="success" type="submit">
              <FaSearch size={24} />
            </Button>
          </Col>
        </Row>
      </Form>
      <Listagem>
        <h3>Lista de Membros</h3>
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
                <th scope="col">Nº Ficha</th>
                <th scope="col">Nome</th>
                <th scope="col">Telefone</th>
                <th scope="col">Classe</th>
                <th scope="col">Detalhes</th>
                <th scope="col">Foto</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {aluno.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>
                    <Image src={dado.url} style={{ width: "80px" }} />
                  </td>
                  <td>{dado.nome}</td>
                  <td>{dado.telefone}</td>
                  <td>{dado.desc_classes}</td>
                  <td>
                    <Button
                      variant="dark"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(`/cadFoto/${dado.id}/aluno`);
                      }}
                    >
                      <FaCamera size={16} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(`/detailAluno/${dado.id}`);
                      }}
                    >
                      <FaRegListAlt size={16} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.dep_descricao);
                        history.push(`/cadAluno/${dado.id}/edit`);
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
