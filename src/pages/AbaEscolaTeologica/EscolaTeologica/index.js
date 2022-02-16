import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { Container } from '../../../styles/GlobalStyles';

import Loading from '../../../components/Loading';
import Card from '../../../components/Card';
import history from '../../../services/history';
import { ContainerBox } from './styled';

export default function Ebd() {
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
        <h1>Escola Teológica</h1>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/cadAlunoTeologia">
              <ContainerBox>
                <FaChalkboardTeacher size={50} />
                <span>Cadastro de Aluno</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/cadClasseTeologia">
              <ContainerBox>
                <FaChalkboardTeacher size={50} />
                <span>Cadastro de Classe</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/teologiaChamada">
              <ContainerBox>
                <FaChalkboardTeacher size={50} />
                <span>Chamada</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/listAlunosTeologia">
              <ContainerBox>
                <FaChalkboardTeacher size={50} />
                <span>Lista de Alunos</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/teologiaLivro">
              <ContainerBox>
                <FaChalkboardTeacher size={50} />
                <span>Controle de Livros</span>
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
