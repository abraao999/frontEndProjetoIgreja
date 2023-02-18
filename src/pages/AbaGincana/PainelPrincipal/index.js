/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { MdArrowBack, MdSchool } from "react-icons/md";
import { Container } from "../../../styles/GlobalStyles";

import Loading from "../../../components/Loading";

import { ContainerBox } from "./styled";
import axios from "../../../services/axiosMongo";

export default function PainelPrincipal() {
  const [isLoading, setIsLoading] = useState(false);
  const storage = useSelector((state) => state.auth);
  const [listaLivros, setListaLivros] = useState([]);
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get("/livro");
      setListaLivros(response.data);
      console.log(storage.user);
      setIsLoading(false);
    }
    getData();
  }, []);

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <h1>Selecione o Livro</h1>
        <Row>
          {listaLivros.map((dado) => (
            <Col
              key={dado.titulo}
              xs={6}
              sm={6}
              lg={3}
              md={4}
              style={{ marginTop: "1rem" }}
            >
              <Link to={`/painelPergunta/${dado._id}/${dado.titulo}`}>
                <ContainerBox>
                  <MdSchool size={12} />
                  <span>{dado.titulo}</span>
                </ContainerBox>
              </Link>
            </Col>
          ))}
        </Row>

        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/">
              <ContainerBox>
                <MdArrowBack size={50} />
                <span>Painel Principal</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
