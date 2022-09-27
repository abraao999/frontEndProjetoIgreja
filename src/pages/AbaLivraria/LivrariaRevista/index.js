import React from "react";

import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { Container } from "../../../styles/GlobalStyles";

import { ContainerBox } from "./styled";

export default function LivrariaRevista() {
  return (
    <>
      <Container>
        <h1>Revistas</h1>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/pedidoRevista">
              <ContainerBox>
                <FaBook size={50} />
                <span>Adcionar Pedido</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/listaPedidoRevista">
              <ContainerBox>
                <FaBook size={50} />
                <span>Lista de Pedido</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/livraria">
              <ContainerBox>
                <MdArrowBack size={50} />
                <span>Livraria</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
