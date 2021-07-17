/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
export default function Dropdown({ nome, opcoes }) {
  return (
    <NavDropdown title={nome} id="collasible-nav-dropdown">


      {opcoes.map((opcao) => (
        <NavDropdown.Item key={opcao.desc} href={opcao.path}>{opcao.desc}</NavDropdown.Item>

      ))}
    </NavDropdown>
  );
}

Dropdown.defaultProps = {
  nome: '',
  opcoes: [],
};
Dropdown.protoTypes = {
  nome: PropTypes.string,
  opcoes: PropTypes.array,
};
