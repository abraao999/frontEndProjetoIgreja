/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as colors from "../../config/colors";
import { CancelarButton, Table } from "./styled";
// eslint-disable-next-line react/prop-types
export default function ModalDetailVenda({
  title,
  list,
  handleClose,
  show,
  buttonCancel,
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Descrição</th>
                <th scope="col">Valor</th>
              </tr>
            </thead>
            <tbody>
              {list.map((dado) => (
                <tr key={String(dado.id)}>
                  <td>{dado.descricao}</td>
                  <td>{dado.valor}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <CancelarButton onClick={handleClose}>{buttonCancel}</CancelarButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalDetailVenda.defaultProps = {
  title: "",
  list: [],
  buttonCancel: "",
  buttonConfirm: "",
  show: false,
};
ModalDetailVenda.protoTypes = {
  nome: PropTypes.string,
  list: PropTypes.array,
  buttonCancel: PropTypes.string,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};
