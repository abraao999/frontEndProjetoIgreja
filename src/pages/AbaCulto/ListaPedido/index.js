/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose } from 'react-icons/fa';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import { getDataBanco, getDataDB, getToday } from '../../../util';
import { Box, Label, LabelInput } from './styled';
import axios from '../../../services/axios';

import Loading from '../../../components/Loading';
import history from '../../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function ListaPedido({ match }) {
  const [listPedidos, setListPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const list = [];
      const today = getToday();
      axios.get('/pedido').then((response) => {
        response.data.map((dados) => {
          const dataDb = new Date(dados.data_culto);
          if (today === getDataBanco(dataDb)) {
            list.push(dados);
          }
        });
        setListPedidos(list);
        console.log(list);
      });

      setIsLoading(false);
    }
    getData();
  }, []);

  return (
    <Container>
      <h1>Lista de pedidos de oração</h1>
      <Loading isLoading={isLoading} />

      <Row>
        {listPedidos.map((nada) => (
          <Col sm={12} md={6} className="my-1" key={nada.id}>
            <Box>
              <p>
                <strong>Solicitante:</strong> {nada.solicitante}
              </p>
              <p>
                <strong>Favorecido:</strong> {nada.favorecido}
              </p>
              <p>
                <strong>Pedido:</strong> {nada.pedido}
              </p>
            </Box>
          </Col>
        ))}
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
ListaPedido.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
