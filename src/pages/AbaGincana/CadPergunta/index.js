/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { toast } from "react-toastify";
import { FaEdit, FaWindowClose } from "react-icons/fa";
import { get } from "lodash";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { Container } from "../../../styles/GlobalStyles";
import { Listagem } from "./styled";
import axios from "../../../services/axiosMongo";
import Loading from "../../../components/Loading";
import ComboBox from "../../../components/ComboBox";
import history from "../../../services/history";
// import * as actions from '../../store/modules/auth/actions';

export default function CadPerguntas({ match }) {
  // const id = get(match, 'params.id', '');
  // const [show, setShow] = useState(false);
  // const [idParaDelecao, setIdParaDelecao] = useState('');
  // const [indiceDelecao, setIndiceDelecao] = useState('');
  // const [msg, setMsg] = useState(true);

  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [alternativa2, setAlternativa2] = useState("");
  const [alternativa3, setAlternativa3] = useState("");
  const [alternativa4, setAlternativa4] = useState("");
  const [livroId, setLivroId] = useState("");
  const [descLivro, setDescLivro] = useState("");

  const [listLivros, setListLivros] = useState([]);
  const [listPerguntas, setListPerguntas] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [titulo, setTitulo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checado, setChecado] = useState(true);
  const [alternativa, setAlternativa] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [hiddenAlternativa, setHiddenAlternativa] = useState(true);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get("/pergunta");
      setListPerguntas(response.data);
      const response2 = await axios.get("/livro");
      setListLivros(response2.data);

      setIsLoading(false);
    }
    getData();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    // if (
    //   descricao.length < 3 ||
    //   descricao.length > 255 ||
    //   setorSeletected === 0
    // ) {
    //   formErrors = true;
    //   setIsLoading(false);
    //   toast.error('Preencha todos os campos');
    // }
    // if (formErrors) return;
    try {
      await axios.post("/pergunta", {
        livroId,
        pergunta,
        alternativa,
        resposta,
        alternativa2,
        alternativa3,
        alternativa4,
      });

      setPergunta("");
      setResposta("");
      setAlternativa2("");
      setAlternativa3("");
      setAlternativa4("");

      const response = await axios.get("/pergunta");
      const n = [];
      response.data.map((dado) => {
        if (dado.livroId === livroId) n.push(dado);
      });
      setListPerguntas(n);
      setIsLoading(false);
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      if (status === 401) {
        toast.error("Voce precisa fazer loggin");
      } else {
        toast.error("Erro ao excluir uma Classe");
      }
      setIsLoading(false);
    }
  }
  const handleIdLivro = async (value) => {
    let d = 0;
    const novaLista = [];
    setDescLivro(value);
    setHidden(false);
    listLivros.map(async (dado) => {
      if (dado.titulo === value) {
        setLivroId(dado._id);
        setTitulo(dado.titulo);
        d = dado._id;
      }
    });
    console.log(d);
    listPerguntas.map((vpergunta) => {
      if (vpergunta.livroId === d) {
        novaLista.push(vpergunta);
      }
    });
    setListPerguntas(novaLista);
  };
  return (
    <Container>
      <h1>Nova Pergunta</h1>
      <Loading isLoading={isLoading} />
      <ComboBox
        title="Livro da Bíblia"
        list={listLivros}
        value={descLivro}
        onChange={(e) => {
          handleIdLivro(e.target.value);
        }}
      />
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={12} className="my-1">
            <Form.Label htmlFor="descricao">Pergunta:</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={pergunta}
              onChange={(e) => {
                setPergunta(e.target.value);
              }}
              placeholder="Pergunta"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} className="my-1">
            <Form.Label htmlFor="descricao">Resposta:</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={resposta}
              onChange={(e) => {
                setResposta(e.target.value);
              }}
              placeholder="Resposta"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} className="my-1">
            <Form.Label htmlFor="batizado">Alternativas</Form.Label>
            <Form.Check id="sim" checked={checado} type="radio" label="Não" />
            <Form.Check
              type="radio"
              label="Sim"
              onChange={() => {
                setHiddenAlternativa(false);
                setAlternativa(true);
                setChecado(false);
              }}
            />
          </Col>
        </Row>
        <section hidden={hiddenAlternativa}>
          <Row>
            <Col sm={12} md={12} className="my-1">
              <Form.Label htmlFor="descricao">Alternativa 2:</Form.Label>
              <Form.Control
                id="input"
                type="text"
                value={alternativa2}
                onChange={(e) => {
                  setAlternativa2(e.target.value);
                }}
                placeholder="Alternativa 2"
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12} className="my-1">
              <Form.Label htmlFor="descricao">Alternativa 3:</Form.Label>
              <Form.Control
                id="input"
                type="text"
                value={alternativa3}
                onChange={(e) => {
                  setAlternativa3(e.target.value);
                }}
                placeholder="Alternativa 3"
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12} className="my-1">
              <Form.Label htmlFor="descricao">Alternativa 4:</Form.Label>
              <Form.Control
                id="input"
                type="text"
                value={alternativa4}
                onChange={(e) => {
                  setAlternativa4(e.target.value);
                }}
                placeholder="Alternativa 4"
              />
            </Col>
          </Row>
        </section>
        <Row>
          <Button variant="success" type="submit">
            Salvar
          </Button>
        </Row>
      </Form>
      <Listagem hidden={hidden}>
        <h3>Lista de Perguntas</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Livro</th>
                <th scope="col">Pergunta</th>
                <th scope="col">Resposta</th>
                <th scope="col">Alternativa 2</th>
                <th scope="col">Alternativa 3</th>
                <th scope="col">Alternativa 4</th>
                <th scope="col">Alterar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {listPerguntas.map((dado, index) => (
                <tr key={String(index)}>
                  <td>{titulo}</td>
                  <td>{dado.pergunta}</td>
                  <td>{dado.resposta}</td>
                  <td>{dado.alternativa2}</td>
                  <td>{dado.alternativa3}</td>
                  <td>{dado.alternativa4}</td>

                  <td>
                    <Button
                      variant="warning"
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.descricao);
                        history.push(`/cadPergunta/${dado.id}/edit`);
                      }}
                      // to={`/cadPergunta/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      // onClick={() => handleShow(dado.id, index)}
                      to={`/cadPergunta/${dado.id}/delete`}
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
CadPerguntas.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
