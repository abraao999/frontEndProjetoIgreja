import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { Container } from "../../../styles/GlobalStyles";

import Loading from "../../../components/Loading";

import { ContainerBox } from "./styled";

export default function PainelLivrariaAberta() {
  const [isLoading, setIsLoading] = useState(false);
  const storage = useSelector((state) => state.auth);
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      console.log(storage.user);
      setIsLoading(false);
    }
    getData();
  }, []);

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <h1>Livraria</h1>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/pedidoLivroAberto">
              <ContainerBox>
                <FaBook size={50} />
                <span>Adcionar Pedido de Livro</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/cadCamiseta">
              <ContainerBox>
                <FaBook size={50} />
                <span>Cadastro de Camiseta</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
