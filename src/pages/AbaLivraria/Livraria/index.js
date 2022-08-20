import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AiOutlineSetting } from 'react-icons/ai';
import { FaBook, FaCalculator, FaUserTie } from 'react-icons/fa';
import { MdArrowBack, MdSchool } from 'react-icons/md';
import { Container } from '../../../styles/GlobalStyles';

import Loading from '../../../components/Loading';
import Card from '../../../components/Card';
import history from '../../../services/history';
import { ContainerBox } from './styled';

export default function Livraria() {
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
            <Link to="/cadLivro">
              <ContainerBox>
                <FaBook size={50} />
                <span>Cadastro de Livro</span>
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
          <Col sm={6} md={4} className="my-1">
            <Link to="/listaPedidoLivraria">
              <ContainerBox>
                <FaBook size={50} />
                <span>Lista de Pedidos</span>
              </ContainerBox>
            </Link>
          </Col>

        </Row>
        <Row>

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
