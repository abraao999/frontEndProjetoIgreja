import React from "react";

import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { Container } from "../../../styles/GlobalStyles";

import { ContainerBox } from "./styled";

export default function LivrariaLivro() {
  return (
    <>
      <Container>
        <h1>Livros</h1>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/pedidoLivro">
              <ContainerBox>
                <FaBook size={50} />
                <span>Adcionar Pedido</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/cadLivro">
              <ContainerBox>
                <FaBook size={50} />
                <span>Cadastro</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/estoque">
              <ContainerBox>
                <FaBook size={50} />
                <span>Estoque</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/fiado">
              <ContainerBox>
                <FaBook size={50} />
                <span>Fiado</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/listaPedidoLivraria">
              <ContainerBox>
                <FaBook size={50} />
                <span>Lista de Pedidos</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/venda">
              <ContainerBox>
                <FaBook size={50} />
                <span>Painel de Vendas</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/relatorioVendas">
              <ContainerBox>
                <FaBook size={50} />
                <span>Relatório de Vendas</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/reservaLivros">
              <ContainerBox>
                <FaBook size={50} />
                <span>Reservas</span>
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
