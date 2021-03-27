import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import {
  FaUserCircle,
  FaEdit,
  FaWindowClose,
  FaExclamation,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import { Form, ListFuncoesConteiner, Listagem } from './styled';
import axios from '../../services/axios';

import Loading from '../../components/Loading';
import history from '../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function Funcao({ match }) {
  const dispath = useDispatch();
  const id = get(match, 'params.id', '');

  const [descricao, setDescricao] = useState('');
  const [descricaoList, setDescricaoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/funcao');
      console.log(response.data);
      console.log('idfuncao', id);
      setDescricaoList(response.data);
      // if(idFuncao){

      // }
      setIsLoading(false);
    }
    getData();
  }, [id]);
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
        const response = await axios.post('/funcao', { descricao });
        console.log(response);
        const novaLista = await axios.get('/funcao');
        setDescricaoList(novaLista.data);
        setDescricao('');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/funcao/${id}`, { descricao });
        console.log(response);
        const novaLista = await axios.get('/funcao');
        setDescricaoList(novaLista.data);
        setDescricao('');
        history.push('/funcao');
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
  const handleDeleteAsk = (e) => {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute('display', 'block');
    e.currentTarget.remove();
  };
  const handleDelete = async (e, idFuncao, index) => {
    e.persist();
    try {
      setIsLoading(true);
      await axios.delete(`/funcao/${idFuncao}`);
      const novosFuncoes = [...descricaoList];
      novosFuncoes.splice(index, 1);
      setDescricaoList(novosFuncoes);
      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir um função');
      }
      setIsLoading(false);
    }
  };
  return (
    <Container>
      <h1>{id ? 'Editar Aluno' : 'Novo Aluno'}</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <label htmlFor="descricao">
          Nome da função:
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Função"
          />
        </label>
        <button type="submit">Salvar</button>
      </Form>
      <Listagem>
        <h3>Lista de Funções</h3>
        <center>
          <ListFuncoesConteiner>
            {descricaoList.map((funcao, index) => (
              <div key={String(funcao.id)}>
                <span>{funcao.descricao}</span>
                <Link
                  onClick={(e) => {
                    setDescricao(funcao.descricao);
                    history.push(`/funcao/${funcao.id}/edit`);
                  }}
                  to={`/funcao/${funcao.id}/edit`}
                >
                  <FaEdit size={16} />
                </Link>
                <Link
                  onClick={handleDeleteAsk}
                  to={`/aluno/${funcao.id}/delete`}
                >
                  <FaWindowClose size={16} />
                </Link>

                <FaExclamation
                  onClick={(e) => handleDelete(e, funcao.id, index)}
                  size={16}
                  display="none"
                  cursor="pointer"
                />
              </div>
            ))}
          </ListFuncoesConteiner>
        </center>
      </Listagem>
    </Container>
  );
}
Funcao.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
