/* eslint-disable import/order */
import React from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';
import { Conteiner } from './styled';
import { Col, Row } from 'react-bootstrap';

export default function Header() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispath = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    dispath(actions.loginFailure());
    history.push('/');
  };
  const handleRedirect = () => {
    history.push('/login');
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
      <Conteiner>
        <Row>
          <Col md={6}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14926.069631303086!2d-48.9149794!3d-20.7298126!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xef31f10fd1cb582f!2sAssembleia%20de%20Deus%20Min.%20Bel%C3%A9m%20-%20Ol%C3%ADmpia!5e0!3m2!1spt-BR!2sbr!4v1630373912770!5m2!1spt-BR!2sbr"
              title="Localização do templo sede"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </Col>
        </Row>
      </Conteiner>
    </>
  );
}
