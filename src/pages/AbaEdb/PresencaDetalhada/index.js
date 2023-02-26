/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { FaWindowClose, FaSearch } from "react-icons/fa";

import { get } from "lodash";
import { useSelector } from "react-redux";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { Container } from "../../../styles/GlobalStyles";
import { Label, Listagem } from "./styled";
import axios from "../../../services/axios";
import Modal from "../../../components/Modal";
import Loading from "../../../components/Loading";
import moment from "moment";
import "moment/locale/pt-br";
export default function PresencaDetalhada() {
  const [show, setShow] = useState(false);

  const [congregacaoId, setCongregacaoId] = useState("Selecione uma classe");
  const [idParaDelecao, setIdParaDelecao] = useState("");
  const [indiceDelecao, setIndiceDelecao] = useState("");

  const [dataAula, setDataAula] = useState("");

  const [classes, setClasses] = useState([]);
  const [listAlunos, setListAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const dataStorage = useSelector((state) => state.auth);

  useEffect(() => {
    async function getData() {
      const lista = [];
      axios.get("/classe").then((response) => {
        response.data.map((valor) => {
          if (dataStorage.user.setor_id === valor.setor_id) {
            lista.push(valor);
          }
        });
        setClasses(lista);
      });

      // const mes = new Date().getMonth();
      // axios.get(`/dizimo`).then((dado) => {
      //   renderizaLista(dado.data, mes);
      // });
    }
    getData();
  }, []);

  const renderizaLista = (list) => {
    const novaLista = [];
    list.map((dado) => {
      // const data = new Date(dado.data_aula);
      // const dataFormatada = moment(dado.data_aula).format("l");
      novaLista.push({
        id: dado.id,
        nomeAluno: dado.desc_aluno,
        classeId: dado.setorId,
        classeDesc: dado.desc_classes,
        dataAula: dado.data_aula,
      });
    });
    setIsLoading(false);
    setHidden(false);
    setListAlunos(novaLista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const novaList = [];
    if (dataAula) {
      axios.get(`/chamada`).then((dados) => {
        dados.data.map((dado) => {
          let d = dado.data_aula;
          if (moment(d).format("h") == 9)
            d = moment(dado.data_aula).add(1, "d").format("l");
          else d = moment(dado.data_aula).format("l");
          console.log(d, moment(dataAula).format("l"));
          if (
            d == moment(dataAula).format("l") &&
            dado.id_classe === setorSeletected
          ) {
            console.log("aqui");
            novaList.push({ ...dado, data_aula: d });
          }
        });
        renderizaLista(novaList);
      });
    } else {
      toast.error("Selecione todos os campos para filtrar");
      setIsLoading(false);
    }
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
      await axios.delete(`/chamada/${idParaDelecao}`);
      const novaList = [...listAlunos];
      novaList.splice(indiceDelecao, 1);
      setListAlunos(novaList);
      toast.success("Presença excluida com sucesso");
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      if (status === 401) {
        toast.error("Voce precisa fazer loggin");
      } else {
        toast.error("Erro ao excluir a membro");
      }
      setIsLoading(false);
    }
  };
  const handleGetClasseId = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);
    classes.map((dado) => {
      if (nome === dado.descricao) setSetorSeletected(dado.id);
    });
  };

  return (
    <Container>
      <h1>Relatório de presença detalhada</h1>
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
            <Label htmlFor="congregacao">
              Filtrar por classe
              <select onChange={handleGetClasseId} value={congregacaoId}>
                <option value="nada">Selecione a classe</option>
                {classes.map((dado) => (
                  <option key={dado.id} value={dado.descricao}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col xs={10} sm={10} md={5}>
            <Form.Label htmlFor="dataAula">Data aula</Form.Label>
            <Form.Control
              type="date"
              value={dataAula}
              onChange={(e) => {
                setDataAula(e.target.value);
              }}
            />
          </Col>
          <Col
            xs={2}
            sm={2}
            md={2}
            style={{ display: "flex", alignItems: "flex-end", marginTop: 4 }}
          >
            <Button variant="success" type="submit">
              <FaSearch size={16} />
            </Button>
          </Col>
        </Row>
      </Form>
      <Listagem hidden={hidden}>
        <h3>Relatório de Presença</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Data da aula</th>
                <th scope="col">Nome do Membro</th>
                <th scope="col">Classe</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {listAlunos.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.dataAula}</td>
                  <td>{dado.nomeAluno}</td>
                  <td>{dado.classeDesc}</td>

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
        </center>
      </Listagem>
    </Container>
  );
}
