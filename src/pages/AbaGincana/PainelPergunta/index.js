/* eslint-disable react/jsx-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { get, shuffle } from "lodash";
import { Col, Row, Button } from "react-bootstrap";
import { Container } from "../../../styles/GlobalStyles";
import { Header } from "./styled";
import axios from "../../../services/axiosMongo";
import Loading from "../../../components/Loading";

import "moment/locale/pt-br";
import ModalComponent from "../../../components/ModalPergunta";
import ModalAlternativa from "../../../components/ModalAlternativa";
import history from "../../../services/history";

export default function PainelPergunta({ match }) {
  const id = get(match, "params.id", "");
  const titulo = get(match, "params.titulo", "");

  const [show, setShow] = useState(false);
  const [showResposta, setShowResposta] = useState(true);
  const [showAlternativa, setShowAlternativa] = useState(false);
  const [showPerguntas, setShowPerguntas] = useState(true);
  const [showControle, setShowControle] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [listPerguntas, setListPerguntas] = useState([]);
  const [listaAleatoria, setListaAleatoria] = useState([]);

  const [idPergunta, setIdPergunta] = useState(0);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [alternativa2, setAlternativa2] = useState("");
  const [alternativa3, setAlternativa3] = useState("");
  const [alternativa4, setAlternativa4] = useState("");
  const [selecionada, setSelecionada] = useState("");
  const [i, setI] = useState("");

  const [perguntaSelected, setPerguntaSelected] = useState("");

  // reunião de cirgurias eletivas

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const back = localStorage.getItem(titulo);
      const local = JSON.parse(back);
      console.log(titulo);
      // if (local) {
      //   setListPerguntas(local);
      // } else {
      //   localStorage.setItem('listaPerguntas', JSON.stringify(list));
      //   setListPerguntas(list);
      // }
      const response = await axios.get("/pergunta");
      const novaLista = [];
      response.data.map((dado) => {
        if (dado.livroId === id) novaLista.push(dado);
      });

      if (local) {
        setListPerguntas(local);
        console.log(local);
      } else {
        localStorage.setItem(titulo, JSON.stringify(novaLista));
        setListPerguntas(novaLista);
        setShowControle(true);
        setShowPerguntas(false);
      }
      // await buscaReservas();
      setIsLoading(false);
    }
    getData();
  }, []);

  const handleShowModal = (dado, index) => {
    if (dado.alternativa) {
      setShowAlternativa(true);
      setIdPergunta(dado._id);
      const listaAlternativas = [
        { selected: "vazio", alternativa: dado.resposta },
        { selected: "vazio", alternativa: dado.alternativa2 },
        { selected: "vazio", alternativa: dado.alternativa3 },
        { selected: "vazio", alternativa: dado.alternativa4 },
      ];
      setListaAleatoria(shuffle(listaAlternativas));
      console.log(shuffle(listaAlternativas));

      setPergunta(dado.pergunta);
      setResposta(dado.resposta);
      setAlternativa2(dado.alternativa2);
      setAlternativa3(dado.alternativa3);
      setAlternativa4(dado.alternativa4);
      console.log(dado._id);
      setPerguntaSelected(index + 1);
    } else {
      setShow(true);
      setPergunta(dado.pergunta);
      setResposta(dado.resposta);
      setIdPergunta(dado._id);
      console.log(dado._id);
      setPerguntaSelected(index + 1);
    }
  };

  const handleFunctionConfirm = () => {
    const novaLista = [];
    listaAleatoria.map((dado, index) => {
      if (i === index)
        if (selecionada === resposta)
          novaLista.push({ ...dado, selected: "correta" });
        else novaLista.push({ ...dado, selected: "errada" });
      else if (dado.alternativa === resposta)
        novaLista.push({ ...dado, selected: "correta" });
      else novaLista.push({ ...dado, selected: "vazio" });
    });
    setListaAleatoria(novaLista);
    // setShowResposta(false);
    const novaList = [];
    listPerguntas.map((item) => {
      if (idPergunta === item._id) {
        novaList.push({ ...item, selected: true, pergunta: "nana" });
      } else novaList.push(item);
    });
    setListPerguntas(novaList);
    console.log(novaList);
    localStorage.setItem("listaPerguntas", JSON.stringify(novaList));
  };

  const handleButtonSelected = (index) => {
    const novaLista = [];
    listaAleatoria.map((dado, x) => {
      if (x === index) {
        setI(index);
        setSelecionada(dado.alternativa);
        novaLista.push({ ...dado, selected: "selecionado" });
      } else novaLista.push({ ...dado, selected: "vazio" });
    });
    setListaAleatoria(novaLista);
  };
  const handleReiniciar = async () => {
    localStorage.removeItem(titulo);
    const response = await axios.get("/pergunta");
    const novaLista = [];
    response.data.map((dado) => {
      if (dado.livroId === id) novaLista.push(dado);
    });

    localStorage.setItem(titulo, JSON.stringify(novaLista));
    setListPerguntas(novaLista);
    setShowControle(true);
    setShowPerguntas(false);
  };
  return (
    <Container>
      <Loading isLoading={isLoading} />
      <ModalComponent
        show={show}
        showResposta={showResposta}
        handleClose={() => {
          setShow(false);
          setShowResposta(true);
        }}
        handleFunctionConfirm={handleFunctionConfirm}
        buttonCancel="Fechar"
        buttonConfirm="Mostrar"
        title={`Pergunta ${perguntaSelected} - `}
        pergunta={pergunta}
        resposta={resposta}
      />
      <ModalAlternativa
        show={showAlternativa}
        showResposta={showResposta}
        handleClose={() => {
          setShowAlternativa(false);
          setShowResposta(true);
        }}
        handleFunctionConfirm={handleFunctionConfirm}
        buttonCancel="Fechar"
        buttonConfirm="Mostrar"
        title={`Pergunta ${perguntaSelected} - `}
        pergunta={pergunta}
        resposta={resposta}
        listaAleatoria={listaAleatoria}
        buttonSelected={handleButtonSelected}
      />
      <Header>
        <h2>{titulo}</h2>
      </Header>
      <center
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          height: "30rem",
          flexDirection: "column",
        }}
        hidden={showControle}
      >
        <Button
          variant="success"
          onClick={() => {
            setShowControle(true);
            setShowPerguntas(false);
          }}
          style={{ width: "10rem", height: "5rem", fontSize: "1.5rem" }}
        >
          Continuar
        </Button>
        <Button
          onClick={() => handleReiniciar()}
          variant="success"
          style={{ width: "10rem", height: "5rem", fontSize: "1.5rem" }}
        >
          Reiniciar
        </Button>
        <Button
          onClick={() => history.goBack()}
          variant="success"
          style={{ width: "10rem", height: "5rem", fontSize: "1.5rem" }}
        >
          Voltar
        </Button>
      </center>
      <Row hidden={showPerguntas}>
        {listPerguntas.map((dado, index) => (
          <Col xs={6} sm={6} md={2}>
            <Button
              style={{
                width: "100%",
                height: "3rem",
                marginBottom: 5,
                fontSize: 20,
              }}
              key={String(index)}
              variant={dado.selected ? "danger" : "success"}
              onClick={() => handleShowModal(dado, index)}
              disabled={dado.selected}
            >
              {index + 1}
            </Button>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
PainelPergunta.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
