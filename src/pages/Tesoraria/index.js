import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AiOutlineSetting } from 'react-icons/ai';
import { FaCalculator, FaUserTie } from 'react-icons/fa';
import { MdArrowBack, MdSchool } from 'react-icons/md';
import { Container } from '../../styles/GlobalStyles';

import Loading from '../../components/Loading';
import Card from '../../components/Card';
import history from '../../services/history';
import { ContainerBox } from './styled';

export default function Tesoraria() {
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
        <h1>Tesoraria</h1>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/abatimento">
              <ContainerBox>
                <FaCalculator size={50} />
                <span>Abatimento</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/dizimo">
              <ContainerBox>
                <FaCalculator size={50} />
                <span>Dízimo</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/caixa">
              <ContainerBox>
                <FaCalculator size={50} />
                <span>Lançamento</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/relatorioCaixa">
              <ContainerBox>
                <FaCalculator size={50} />
                <span>Relatório de Caixa</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/relatorioAbatimento">
              <ContainerBox>
                <FaCalculator size={50} />
                <span>Relatório de Abatimento</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/relatorioDiario">
              <ContainerBox>
                <FaCalculator size={50} />
                <span>Relatório de Diário</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/relatorioDizimoGeral">
              <ContainerBox>
                <FaCalculator size={50} />
                <span>Relatório de Dízimo Geral</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/">
              <ContainerBox>
                <MdArrowBack size={50} />
                <span>Relatório de Dízimo</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
