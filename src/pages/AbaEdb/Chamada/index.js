/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { toast } from "react-toastify";
import { FaSearch, FaSave, FaCheck, FaWindowClose } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Container } from "../../../styles/GlobalStyles";
import { Table, Listagem, Label } from "./styled";
import axios from "../../../services/axios";
import Loading from "../../../components/Loading";
import history from "../../../services/history";
import { Button, Col, Form, Row } from "react-bootstrap";
// import * as actions from '../../store/modules/auth/actions';

// eslint-disable-next-line no-unused-vars
export default function Chamada({ match }) {
  const [filtro, setFiltro] = useState(false);
  const [classes, setClasses] = useState([]);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const [congregacaoId, setCongregacaoId] = useState(
    "Selecione uma congregação"
  );
  const dataStorage = useSelector((state) => state.auth);

  const [aluno, setAluno] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aparecer, setAparecer] = useState(true);
  const [listaChamada, setListaChamada] = useState([]);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const lista = [];
      axios.get("/classe").then((response) => {
        response.data.map((valor) => {
          if (dataStorage.user.setor_id === valor.setor_id) {
            lista.push(valor);
          }
        });
        setClasses(lista);
      });
      const response2 = await axios.get("/aluno");
      renderizaLista(response2.data);
      setIsLoading(false);
    }
    getData();
  }, []);
  const renderizaLista = (list) => {
    const novaLista = [];
    list.map((dado) => {
      novaLista.push({ ...dado, chacado: false });
    });
    setAluno(novaLista);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];

    if (!filtro) {
      aluno.map((dados) => {
        if (dados.classe_id === setorSeletected) {
          novaLista.push(dados);
        }
      });
      setFiltro(true);
    } else {
      const response = await axios.get("/aluno");
      response.data.map((dados) => {
        if (dados.classe_id === setorSeletected) {
          novaLista.push(dados);
        }
      });
    }
    setAparecer(false);
    setAluno(novaLista);
    setIsLoading(false);
  }
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);

    classes.map((dado) => {
      if (nome === dado.descricao) setSetorSeletected(dado.id);
    });
  };
  const handleCheck = (dado) => {
    let pula = false;
    let aux = [...aluno];
    const novaLista = [];
    const listaTemporaria = [...listaChamada];

    aux.map((item) => {
      if (item.id === dado) {
        novaLista.push({ ...item, checado: !item.checado });
      } else novaLista.push(item);
    });
    setAluno(novaLista);

    if (listaTemporaria.length > 0) {
      console.log(1);
      listaTemporaria.map((item) => {
        if (item === dado) {
          //procura e remove o iten se já estiver chekados
          listaTemporaria.splice(listaTemporaria.indexOf(item), 1);
          pula = true;
        }
      });
      if (!pula) listaTemporaria.push(dado);
    } else {
      console.log(2, dado);
      listaTemporaria.push(dado);
    }
    setListaChamada(listaTemporaria);
    console.log(listaTemporaria);
  };
  const handleSalvar = () => {
    setIsLoading(true);
    console.log(listaChamada);
    if (listaChamada.length === 0) {
      setIsLoading(false);
      return toast.error("A lista de chamada está vazia");
    }
    try {
      listaChamada.map(async (item) => {
        await axios.post("/chamada", {
          data_aula: new Date(),
          aluno_id: item,
        });
      });
      toast.success("Chamada feita com sucesso");
      history.push("/PresencaDetalhada");
    } catch (error) {
      toast.error("Erro ao atribuir as presenças");
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  return (
    <Container>
      <h1>Chamada</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={10} sm={10} md={10}>
            <Label htmlFor="congregacao">
              Selecione a classe
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
          <Col
            xs={2}
            sm={2}
            md={2}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Button size="lg" variant="success" type="submit">
              <FaSearch size={16} />
            </Button>
          </Col>
        </Row>
      </Form>
      <Listagem hidden={aparecer}>
        <h3>Lista de Alunos</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Presença</th>
              </tr>
            </thead>
            <tbody>
              {aluno.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.nome}</td>
                  <td>
                    {dado.checado ? (
                      <Button
                        variant="success"
                        onClick={() => handleCheck(dado.id, index)}
                      >
                        <FaCheck size={16} />
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        onClick={() => handleCheck(dado.id, index)}
                      >
                        <FaWindowClose size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="success" onClick={handleSalvar}>
            Salvar <FaSave />
          </Button>
        </center>
      </Listagem>
    </Container>
  );
}
Chamada.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
