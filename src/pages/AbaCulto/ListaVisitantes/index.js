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

export default function ListaVisitantes({ match }) {
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [telefone, setTelefone] = useState('');

  const [maxId, setMaxId] = useState(0);
  const [nome, setNome] = useState('');
  const [nomeIgreja, setIngrejaNome] = useState('');
  const [observacao, setObservacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [listFamilias, setListFamilias] = useState([]);
  const [nomesList, setNomesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [crente, setCrente] = useState(true);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const list = [];
      const familias = [];
      const today = getToday();
      axios.get('/nomesVisitante').then((response) => {
        response.data.map((dados) => {
          const dataDb = new Date(dados.dataCulto);
          if (today === getDataBanco(dataDb)) {
            list.push(dados);
          }
        });
        setNomesList(list);
        console.log(list);
      });
      axios.get('/familiaVisitante').then((response) => {
        response.data.map((dados) => {
          const dataDb = new Date(dados.data_culto);
          if (today === getDataBanco(dataDb)) {
            familias.push(dados);
          }
        });
        setListFamilias(familias);
        console.log(list);
      });
      setIsLoading(false);
    }
    getData();
  }, []);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (index) => {
    const novosNomes = [...nomesList];
    novosNomes.splice(index, 1);
    setNomesList(novosNomes);
  };
  const handleFunctionConfirm = async (e) => {
    e.preventDefault();
    // setShow(true);
    try {
      setIsLoading(true);
      const response = await axios.post(`/familiaVisitante/`, {
        telefone,
        igreja: nomeIgreja,
        crente,
        observacao,
        data_culto: new Date(),
      });
      const idResposta = response.data.id;
      nomesList.map(async (item) => {
        await axios.post('/nomesVisitante', {
          familia_id: idResposta,
          nome: item.nome,
        });
      });
      toast.success('Visitante adcionado com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao adicionar o visitantes');
      }
      setIsLoading(false);
    }
  };
  const handleCrente = (e) => {
    if (String(e.target.value) === 'Sim') setCrente(true);
    else setCrente(false);
  };
  const addNome = () => {
    nomesList.push({ id: Math.random(), nome });
    setHidden(false);
    setNome('');
    const input = document.getElementById('nome');
    input.focus();
  };

  return (
    <Container>
      <h1>Lista Visitantes</h1>
      <Loading isLoading={isLoading} />
      <p>{descricao}</p>

      <Row>
        {listFamilias.map((nada) => (
          <Col sm={12} md={6} className="my-1" key={nada.id}>
            <Box>
              <h3>Familia: {nada.id}</h3>
              <p>
                <strong>Observação:</strong> {nada.observacao}
              </p>
              <p>
                <strong>Igreja:</strong> {nada.igreja}
              </p>
              <p>
                <strong>Convertido:</strong> {nada.crente ? 'Sim' : 'Não'}
              </p>
              <ul style={{ paddingLeft: 0 }}>
                {nomesList.map(
                  (dado) =>
                    dado.familia_id === nada.id && (
                      <li key={dado.id}>{dado.nome}</li>
                    )
                )}
              </ul>
            </Box>
          </Col>
        ))}
      </Row>
      <Row style={{ margin: 5 }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            history.push('/visitante');
          }}
          type="button"
        >
          Voltar
        </button>
      </Row>
    </Container>
  );
}
ListaVisitantes.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
