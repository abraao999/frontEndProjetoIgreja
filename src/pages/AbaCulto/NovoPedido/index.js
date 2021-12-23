import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { get, methodOf } from 'lodash';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import Modal from '../../../components/Modal';

import axios from '../../../services/axios';

import Loading from '../../../components/Loading';
import ComboBox from '../../../components/ComboBox';
import history from '../../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function NovoPedido({ match }) {
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);

  const [solicitante, setSolicitante] = useState('');
  const [favorecido, setFavorecido] = useState('');
  const [pedido, setPedido] = useState('');
  const [comboBoxPedido, setComboBoxPedido] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const listPedidos = [
    { id: 0, descricao: 'Família' },
    { id: 1, descricao: 'Doença' },
    { id: 2, descricao: 'Viagem' },
    { id: 3, descricao: 'Outro' },
  ];

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      // const response = await axios.get('/visitantes/maxId');
      // setMaxId(response.data);
      // setDescricaoList(response.data);

      setIsLoading(false);
    }

    getData();
  }, [id]);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    if (!solicitante || !favorecido || !pedido) {
      toast.error('Preencha todos os campos');
      return;
    }
    setShow(true);
  };
  const handleFunctionConfirm = async (e) => {
    e.preventDefault();
    // setShow(true);

    try {
      setIsLoading(true);
      const response = await axios.post(`/pedido/`, {
        solicitante,
        favorecido,
        pedido,
        data_culto: new Date(),
      });

      toast.success('Pedido criado com sucesso');
      setShow(false);
      history.push('/pedidoOracao');
      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao adicionar o pedido');
      }
      setIsLoading(false);
    }
  };
  const handlePedido = (e) => {
    setComboBoxPedido(e.target.value);
    if (e.target.value === 'Outro') {
      setComboBoxPedido(e.target.value);
      setHidden(false);
      setPedido('');
    } else setPedido(e.target.value);
  };
  return (
    <Container>
      <h1>Novo Visitante</h1>
      <Loading isLoading={isLoading} />
      <Modal
        title="Atenção!!!"
        handleClose={handleClose}
        show={show}
        text="Deseja confirmar esse pedido"
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleFunctionConfirm}
      />
      <Form onSubmit={handleFunctionConfirm}>
        <Row>
          <Col sm={12} xs={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Quem está pedido:</Form.Label>
            <Form.Control
              type="text"
              value={solicitante}
              id="nome"
              onChange={(e) => setSolicitante(e.target.value)}
              placeholder="Nome do Solicitante"
            />
          </Col>

          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Para:</Form.Label>
            <Form.Control
              type="text"
              value={favorecido}
              onChange={(e) => setFavorecido(e.target.value)}
              placeholder="Para quem está pedindo"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <ComboBox
              title="Motivo do pedido"
              value={comboBoxPedido}
              list={listPedidos}
              onChange={(e) => {
                handlePedido(e);
              }}
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Motivo:</Form.Label>
            <Form.Control
              type="text"
              value={pedido}
              onChange={(e) => setPedido(e.target.value)}
              placeholder="Pedido de oração"
              disabled={hidden}
            />
          </Col>
        </Row>
      </Form>
      <Row style={{ margin: 5 }}>
        <button type="button" onClick={handleShow}>
          Salvar
        </button>
      </Row>
      <Row style={{ margin: 5 }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            history.push('/pedidoOracao');
          }}
          type="button"
        >
          Voltar
        </button>
      </Row>
    </Container>
  );
}
NovoPedido.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
