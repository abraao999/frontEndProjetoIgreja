import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AiOutlineSetting } from 'react-icons/ai';
import { FaCalculator, FaUserTie } from 'react-icons/fa';
import { MdArrowBack, MdSchool } from 'react-icons/md';
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
        <h1>EBD</h1>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/classe">
              <ContainerBox>
                <MdSchool size={50} />
                <span>Cadastro de Classe</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/cadAluno">
              <ContainerBox>
                <MdSchool size={50} />
                <span>Cadastro de Aluno</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/caixaEbd">
              <ContainerBox>
                <MdSchool size={50} />
                <span>Caixa</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/chamada">
              <ContainerBox>
                <MdSchool size={50} />
                <span>Chamada</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/listAluno">
              <ContainerBox>
                <MdSchool size={50} />
                <span>Lista de Alunos</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/relatorioCaixaEbd">
              <ContainerBox>
                <MdSchool size={50} />
                <span>Relatorio de Caixa</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/relatorioPresencaDiaria">
              <ContainerBox>
                <MdSchool size={50} />
                <span>Presença Diária</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/relatorioPresencaGeral">
              <ContainerBox>
                <MdSchool size={50} />
                <span>Presença Geral</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/presencaDetalhada">
              <ContainerBox>
                <MdSchool size={50} />
                <span>Presença detalhada</span>
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
