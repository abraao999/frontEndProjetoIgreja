/* eslint-disable import/order */
import React from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';
import logo from '../../assets/images/logo.png';
// import { Nav, Conteiner } from './styled';
import Dropdown from '../Dropdowm';
import { Navbar, Nav, Container } from 'react-bootstrap';
import * as colors from '../../config/colors';

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
    { desc: 'MÉDIA DE CAIXA', path: '/mediaCaixa' },
    { desc: 'RELATÓRIO', path: '/relatorioCaixa' },
    { desc: 'RELATÓRIO ABATIMENTO', path: '/relatorioAbatimento' },
    { desc: 'RELATÓRIO DIÁRIO', path: '/relatorioDiario' },
    { desc: 'RELATÓRIO DÍZIMO', path: '/relatorioDizimo' },
    { desc: 'RELATÓRIO DÍZIMO DIARIO', path: '/dizimoDiario' },
    { desc: 'RELATÓRIO DÍZIMO GERAL', path: '/relatorioDizimoGeral' },
  ];
  const departamentos = [
    { desc: 'EBD', path: '/ebd' },
    { desc: 'JOVENS', path: '/jovens' },
  ];
  const culto = [
    { desc: 'DIZIMISTAS DO DIA', path: '/dizimoDiario' },
    { desc: 'NOVO VISITANTE', path: '/novoVisitante' },
    { desc: 'NOVO PEDIDO DE ORAÇÃO', path: '/novoPedido' },
    { desc: 'LISTA DE VISITANTES', path: '/listaVisitantes' },
    { desc: 'LISTA DE PEDIDOS DE ORAÇÃO', path: '/listaPedido' },
  ];
  const secretaria = [
    { desc: 'ALTARAR SENHA', path: '/editPass' },
    { desc: 'LISTA DE ANIVERSÁRIOS', path: '/listAniversario' },
    { desc: 'CADASTRO DE MEMBROS', path: '/cadMembro' },
    { desc: 'LISTA DE MEMBROS', path: '/listMembros' },
    { desc: 'PERMISSÃO DE USUARIO', path: '/controleAcesso' },
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
    <Navbar
      style={{ background: colors.primaryColor }}
      expand="lg"
      variant="dark"
    >
      <Container>
        <img
          src={logo}
          width="30"
          height="30"
          style={{ marginRight: 5 }}
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
        <Navbar.Brand href="/">AD BELÉM OLIMPIA</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">HOME</Nav.Link>
            <Dropdown nome="CULTO" opcoes={culto} />
            {!isLoggedIn && (
              <Dropdown nome="DEPARTAMENTOS" opcoes={departamentos} />
            )}
            {isLoggedIn && (
              <Dropdown nome="CONFIGURAÇÕES" opcoes={configuracoes} />
            )}
            {isLoggedIn && <Dropdown nome="SECRETARIA" opcoes={secretaria} />}
            {isLoggedIn && <Dropdown nome="TESOURARIA" opcoes={caixa} />}
            {isLoggedIn && <Dropdown nome="EBD" opcoes={ebd} />}
            {!isLoggedIn && <Nav.Link href="/contato">FALE CONOSCO</Nav.Link>}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <Nav.Link onClick={handleLogout} href="/login">
                <FaSignOutAlt size={24} />
                Sair
              </Nav.Link>
            ) : (
              <Nav.Link href="/login">
                <FaSignInAlt size={24} />
                Entrar
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
