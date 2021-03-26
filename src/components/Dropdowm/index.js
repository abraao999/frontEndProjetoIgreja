/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export default function Dropdown({ nome, opcoes }) {
  return (
    <div className="dropdown">
      <button
        className=" dropdown-toggle"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {nome}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        {opcoes.map((opcao) => (
          <li key={opcao.desc}>
            <Link className="dropdown-item" to={opcao.path}>
              {opcao.desc}
            </Link>
          </li>
        ))}
      </ul>
    </div>
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
