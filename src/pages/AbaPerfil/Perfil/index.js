import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { Container } from "../../../styles/GlobalStyles";

import { ContainerBox } from "./styled";
import * as actions from "../../../store/modules/auth/actions";

export default function Perfil() {
  const dispath = useDispatch();
  const storage = useSelector((state) => state.auth);
  return (
    <>
      <Container>
        <h1>Meu Perfil</h1>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to={`/editPass/${storage.user.id}`}>
              <ContainerBox>
                <FaUserTie size={50} />
                <span>Alterar senha</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/meuCadastro">
              <ContainerBox>
                <FaUserTie size={50} />
                <span>Meu Cadastro</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/controleCarterinha">
              <ContainerBox>
                <FaUserTie size={50} />
                <span>Controle Carterinha</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/listAniversario">
              <ContainerBox>
                <FaUserTie size={50} />
                <span>Lista de Aniversário</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/listMembros">
              <ContainerBox>
                <FaUserTie size={50} />
                <span>Lista de Membros</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/controleAcesso">
              <ContainerBox>
                <FaUserTie size={50} />
                <span>Permissão de Usuário</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/login">
              <ContainerBox>
                <MdArrowBack size={50} />
                <span>Sair</span>
              </ContainerBox>
            </Link>
          </Col>
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
