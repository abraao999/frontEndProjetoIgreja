import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AiOutlineSetting } from 'react-icons/ai';
import { FaCalculator, FaUserTie } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';
import { Container } from '../../styles/GlobalStyles';

import Loading from '../../components/Loading';
import Card from '../../components/Card';
import history from '../../services/history';
import { ContainerBox } from './styled';

export default function Painel() {
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
        <h1>Seja bem vindo {storage.user.nome}</h1>
        <Row>
          <Col sm={6} md={3} className="my-1">
            <Link to="/ebd">
              <ContainerBox>
                <MdSchool size={50} />
                <span>Escola Bíblica Dominical</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={3} className="my-1">
            <Link to="/configuracoes">
              <ContainerBox>
                <AiOutlineSetting size={50} />
                <span>Configuracao</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={3} className="my-1">
            <Link to="/secretaria">
              <ContainerBox>
                <FaUserTie size={50} />
                <span>Secretaria</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={3} className="my-1">
            <Link to="/tesoraria">
              <ContainerBox>
                <FaCalculator size={50} />
                <span>Tesoraria</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
