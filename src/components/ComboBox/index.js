/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";

import { Label } from "./styled";
// eslint-disable-next-line react/prop-types
export default function ComboBox({ title, onChange, value, list, disabled }) {
  return (
    <Label htmlFor="congregacao">
      {title}
      <select onChange={onChange} value={value} disabled={disabled}>
        <option value="nada">{title}</option>
        {list.map((dado) => (
          <option key={dado.id} value={dado.descricao}>
            {dado.descricao}
          </option>
        ))}
      </select>
    </Label>
  );
}

ComboBox.defaultProps = {
  title: "",
  value: "",
  buttonConfirm: "",
  list: [],
  show: false,
  disable: true,
};
ComboBox.protoTypes = {
  nome: PropTypes.string,
  list: PropTypes.array,
  value: PropTypes.string,
  show: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  handleFunctionConfirm: PropTypes.func,
};
