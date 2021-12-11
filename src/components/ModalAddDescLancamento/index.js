/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import * as colors from '../../config/colors';
import { CancelarButton, Form } from './styled';
// eslint-disable-next-line react/prop-types
export default function ModalAddDescLancamento({
  handleClose,
  show,
  descricao,
  handleFunctionConfirm,
  onChangeDesc,
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Adiciona Descrição</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <label htmlFor="label">Insira a nova descrição</label>
            <input type="text" value={descricao} onChange={onChangeDesc} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <CancelarButton onClick={handleClose}>Cancelar</CancelarButton>
          <button onClick={handleFunctionConfirm}>Salvar</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalAddDescLancamento.defaultProps = {
  show: false,
  descricao: '',
};
ModalAddDescLancamento.protoTypes = {
  show: PropTypes.bool,
  descricao: PropTypes.string,
  handleClose: PropTypes.func,
  handleFunctionConfirm: PropTypes.func,
  onChangeDesc: PropTypes.func,
};
