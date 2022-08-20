/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as colors from '../../config/colors';
import { CancelarButton, Table } from './styled';
// eslint-disable-next-line react/prop-types
export default function ModalMembro({
  title,
  list,
  handleClose,
  show,
  handleIdMembro,
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
                <th scope="col">Nº Ficha</th>
                <th scope="col">Descrição</th>
                <th scope="col">Selecione</th>
              </tr>
            </thead>
            <tbody>
              {list.map((dado) => (
                <tr key={String(dado.id)}>
                  <td>{dado.id}</td>
                  <td>{dado.nome||dado.descricao}</td>
                  <td>
                    <Button variant='success'>
                    <FaCheck
                      onClick={() => {
                        handleIdMembro(dado.id);
                      }}
                      size={16}
                      color='white'
                    />
                    </Button>
                  </td>
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

ModalMembro.defaultProps = {
  title: '',
  list: [],
  buttonCancel: '',
  buttonConfirm: '',
  show: false,
};
ModalMembro.protoTypes = {
  nome: PropTypes.string,
  list: PropTypes.array,
  handleIdMembro: PropTypes.func,
  buttonCancel: PropTypes.string,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};
