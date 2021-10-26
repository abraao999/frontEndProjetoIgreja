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
import { Listagem, Label, LabelInput } from './styled';
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
  const [descricaoList, setDescricaoList] = useState([]);
  const [nomesList, setNomesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [crente, setCrente] = useState(true);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const list = [];
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
      setIsLoading(false);
    }
    getData();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formErrors = false;

    if (descricao.length < 3 || descricao.length > 255) {
      formErrors = true;
      toast.error('Campo descricao deve ter entre 3 e 255 caracteres');
    }
    if (formErrors) return;
    try {
      if (!id) {
        const response = await axios.post('/cargo', { descricao });
        console.log(response);
        const novaLista = await axios.get('/cargo');
        setDescricaoList(novaLista.data);
        setDescricao('');
        toast.success('Cargo criada com sucesso');

        setIsLoading(false);
      } else {
        const response = await axios.put(`/cargo/${id}`, { descricao });
        console.log(response);
        const novaLista = await axios.get('/cargo');
        setDescricaoList(novaLista.data);
        setDescricao('');
        toast.success('Cargo editado com sucesso');

        history.push('/cargo');
        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir um aluno');
      }
      setIsLoading(false);
    }
  }
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
      <h1>Lista Visitante</h1>
      <Loading isLoading={isLoading} />

      <Listagem>
        <h3>Lista de Visitantes</h3>
        <center>
          {nomesList.map((dado) => (
            <span
              style={{
                backgroundColor: dado.familia_id % 2 === 0 ? 'red' : 'green',
                margin: 0,
              }}
              key={dado.id}
            >
              {dado.nome}
            </span>
          ))}

          <button
            type="button"
            onClick={() => {
              console.log(nomesList);
            }}
          >
            sdsa
          </button>
        </center>
      </Listagem>
    </Container>
  );
}
ListaVisitantes.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
