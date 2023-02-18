/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import * as colors from '../../config/colors';
import { CancelarButton } from './styled';
// eslint-disable-next-line react/prop-types
export default function ModalAlternativa({
  title,
  pergunta,
  resposta,
  handleClose,
  show,
  id,
  listaAleatoria,
  showResposta,
  buttonCancel,
  buttonConfirm,
  handleFunctionConfirm,
  buttonSelected,
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header>
          <Modal.Title>
            {title} {pergunta}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {listaAleatoria.map((dado, index) => (
            <div key={dado}>
              <p>
                {index === 0 && (
                  <Button
                    style={{ textAlign: 'left' }}
                    className="form-control"
                    variant={
                      dado.selected === 'vazio'
                        ? 'light'
                        : dado.selected === 'selecionado'
                        ? 'primary'
                        : dado.selected === 'correta'
                        ? 'success'
                        : 'danger'
                    }
                    onClick={() => buttonSelected(index)}
                  >{`a) ${dado.alternativa}`}</Button>
                )}
              </p>
              <p>
                {index === 1 && (
                  <Button
                    style={{ textAlign: 'left' }}
                    className="form-control"
                    variant={
                      dado.selected === 'vazio'
                        ? 'light'
                        : dado.selected === 'selecionado'
                        ? 'primary'
                        : dado.selected === 'correta'
                        ? 'success'
                        : 'danger'
                    }
                    onClick={() => buttonSelected(index)}
                  >{`b) ${dado.alternativa}`}</Button>
                )}
              </p>
              <p>
                {index === 2 && (
                  <Button
                    style={{ textAlign: 'left' }}
                    className="form-control"
                    variant={
                      dado.selected === 'vazio'
                        ? 'light'
                        : dado.selected === 'selecionado'
                        ? 'primary'
                        : dado.selected === 'correta'
                        ? 'success'
                        : 'danger'
                    }
                    onClick={() => buttonSelected(index)}
                  >{`c) ${dado.alternativa}`}</Button>
                )}
              </p>
              <p>
                {index === 3 && (
                  <Button
                    style={{ textAlign: 'left' }}
                    className="form-control"
                    variant={
                      dado.selected === 'vazio'
                        ? 'light'
                        : dado.selected === 'selecionado'
                        ? 'primary'
                        : dado.selected === 'correta'
                        ? 'success'
                        : 'danger'
                    }
                    onClick={() => buttonSelected(index)}
                  >{`d) ${dado.alternativa}`}</Button>
                )}
              </p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            {buttonCancel}
          </Button>
          <Button
            variant="success"
            type="button"
            onClick={handleFunctionConfirm}
          >
            {buttonConfirm}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalAlternativa.defaultProps = {
  id: 0,
  title: '',
  pergunta: '',
  resposta: '',
  buttonCancel: '',
  buttonConfirm: '',
  show: false,
  showResposta: true,
};
ModalAlternativa.protoTypes = {
  id: PropTypes.int,
  nome: PropTypes.string,
  pergunta: PropTypes.string,
  resposta: PropTypes.string,
  buttonConfirm: PropTypes.string,
  buttonCancel: PropTypes.string,
  show: PropTypes.bool,
  showResposta: PropTypes.bool,
  handleClose: PropTypes.func,
  handleFunctionConfirm: PropTypes.func,
  buttonSelected: PropTypes.func,
  listaAleatoria: PropTypes.array,
};
