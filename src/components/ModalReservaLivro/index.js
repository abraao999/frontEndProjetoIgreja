/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import { Form } from "./styled";
// eslint-disable-next-line react/prop-types
export default function ModalReservaLivro({
  handleClose,
  show,
  nomeCliente,
  email,
  celular,
  handleFunctionConfirm,
  onChangeNomeCliente,
  onChangeEmail,
  onChangeCelular,
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Reservar Livro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <label htmlFor="label">Insira o seu nome</label>
            <input
              type="text"
              value={nomeCliente}
              onChange={onChangeNomeCliente}
            />
          </Form>
          <Form>
            <label htmlFor="label">Insira seu e-mail</label>
            <input type="email" value={email} onChange={onChangeEmail} />
          </Form>
          <Form>
            <label htmlFor="label">Insira seu celular</label>
            <input type="number" value={celular} onChange={onChangeCelular} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleFunctionConfirm}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalReservaLivro.defaultProps = {
  show: false,
  nomeCliente: "",
};
ModalReservaLivro.protoTypes = {
  show: PropTypes.bool,
  nomeCliente: PropTypes.string,
  email: PropTypes.string,
  celular: PropTypes.string,
  handleClose: PropTypes.func,
  handleFunctionConfirm: PropTypes.func,
  onChangeNomeCliente: PropTypes.func,
  onChangeEmail: PropTypes.func,
  onChangeCelular: PropTypes.func,
};
