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

export default function Home() {
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

  const handleRedirect = (path) => {
    history.push(path);
  };
  const caixa = [
    { desc: 'ABATIMENTO', path: '/abatimento' },
    { desc: 'DIZIMO', path: '/dizimo' },
    { desc: 'LANÇAMENTO', path: '/caixa' },
    { desc: 'RELATÓRIO', path: '/relatorioCaixa' },
    { desc: 'RELATÓRIO ABATIMENTO', path: '/relatorioAbatimento' },
    { desc: 'RELATÓRIO DIÁRIO', path: '/relatorioDiario' },
    { desc: 'RELATÓRIO DÍZIMO', path: '/relatorioDizimo' },
    { desc: 'RELATÓRIO DÍZIMO GERAL', path: '/relatorioDizimoGeral' },
  ];
  const departamentos = [
    { desc: 'EBD', path: '/ebd' },
    { desc: 'JOVENS', path: '/jovens' },
  ];
  const secretaria = [
    { desc: 'ALTARAR SENHA', path: '/editPass' },
    { desc: 'LISTA DE ANIVERSÁRIOS', path: '/listAniversario' },
    { desc: 'CADASTRO DE MEMBROS', path: '/cadMembro' },
    { desc: 'LISTA DE MEMBROS', path: '/listMembros' },
  ];
  const configuracoes = [
    { desc: 'CARGOS', path: '/cargo' },
    { desc: 'CLASSES', path: '/classe' },
    { desc: 'CONGREGAÇÃO', path: '/congregacao' },
    { desc: 'DEPARTAMENTOS', path: '/departamento' },
    { desc: 'FUNÇÕES', path: '/funcao' },
  ];
  const ebd = [
    { desc: 'CADASTRO CLASSE', path: '/classe' },
    { desc: 'CADASTRO DE ALUNO', path: '/cadAluno' },
    { desc: 'CAIXA', path: '/caixaEbd' },
    { desc: 'CHAMADA', path: '/chamada' },
    { desc: 'LISTA DE ALUNOS', path: '/listAluno' },
    {
      desc: 'RELATÓRIO DE CAIXA',
      path: '/relatorioCaixaEbd',
    },
    {
      desc: 'RELATÓRIO DE PRESENÇA DIARIA',
      path: '/relatorioPresencaDiaria',
    },
    {
      desc: 'RELATÓRIO DE PRESENÇA GERAL',
      path: '/relatorioPresencaGeral',
    },
    {
      desc: 'PRESENÇA DETALHADA',
      path: '/PresencaDetalhada',
    },
  ];
  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <h1>Seja bem vindo {storage.user.nome}</h1>
        <Row>
          <Col sm={6} md={3} className="my-1">
            <Link to="/cadMembro">
              <ContainerBox>
                <MdSchool size={50} />
                <span>EBD</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={3} className="my-1">
            <Link to="/cadMembro">
              <ContainerBox>
                <AiOutlineSetting size={50} />
                <span>Configuracao</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={3} className="my-1">
            <Link to="/cadMembro">
              <ContainerBox>
                <FaUserTie size={50} />
                <span>Secretaria</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={3} className="my-1">
            <Link to="/cadMembro">
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
