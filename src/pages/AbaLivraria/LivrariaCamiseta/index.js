import React from "react";

import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { Container } from "../../../styles/GlobalStyles";

import { ContainerBox } from "./styled";

export default function LivrariaCamiseta() {
  return (
    <>
      <Container>
        <h1>Camisetas</h1>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/cadCamiseta">
              <ContainerBox>
                <FaBook size={50} />
                <span>Cadastro</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/estoqueCamiseta">
              <ContainerBox>
                <FaBook size={50} />
                <span>Estoque</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/vendaCamiseta">
              <ContainerBox>
                <FaBook size={50} />
                <span>Painel de venda</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/relatorioVendaCamiseta">
              <ContainerBox>
                <FaBook size={50} />
                <span>Relatório de vendas</span>
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
