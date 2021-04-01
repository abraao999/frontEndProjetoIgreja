/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import * as colors from '../../config/colors';
import { CancelarButton } from './styled';
// eslint-disable-next-line react/prop-types
export default function ComboBox({
  title,
  onChange,
  value,
  list,
  handleFunctionConfirm,
}) {
  return (
    <label htmlFor="congregacao">
      {title}
      <select onChange={onChange} value={value}>
        <option value="nada">{title}</option>
        {list.map((dado) => (
          <option key={dado.id} value={dado.descricao}>
            {dado.descricao}
          </option>
        ))}
      </select>
    </label>
  );
}

ComboBox.defaultProps = {
  title: '',
  value: '',
  buttonConfirm: '',
  list: [],
  show: false,
};
ComboBox.protoTypes = {
  nome: PropTypes.string,
  list: PropTypes.array,
  value: PropTypes.string,
  show: PropTypes.bool,
  onChange: PropTypes.func,
  handleFunctionConfirm: PropTypes.func,
};
