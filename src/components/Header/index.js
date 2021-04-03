import React from 'react';
import {
  FaCircle,
  FaHome,
  FaPowerOff,
  FaSignInAlt,
  FaUserAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';
import logo from '../../assets/images/logo.png';
import { Nav, Conteiner } from './styled';
import Dropdown from '../Dropdowm';

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
  const departamentos = [
    { desc: 'EBD', path: '/ebd' },
    { desc: 'JOVENS', path: '/jovens' },
  ];
  const secretaria = [
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
  return (
    <Nav>
      <Conteiner>
        <img src={logo} alt="" srcSet="" />

        <Link to="/">
          <span>HOME</span>
        </Link>
        <Dropdown nome="DEPARTAMENTOS" opcoes={departamentos} />
        {isLoggedIn && <Dropdown nome="CONFIGURAÇÕES" opcoes={configuracoes} />}
        {isLoggedIn && <Dropdown nome="SECRETARIA" opcoes={secretaria} />}
        {!isLoggedIn && (
          <Link to="/contato">
            <span>FALE CONOSCO</span>
          </Link>
        )}
        {isLoggedIn ? (
          <Link onClick={handleLogout} to="/login">
            <FaSignOutAlt size={24} />
            <span>Sair</span>
          </Link>
        ) : (
          <Link to="/login">
            <FaSignInAlt size={24} />
            <span>Entrar</span>
          </Link>
        )}
      </Conteiner>
    </Nav>
  );
}
