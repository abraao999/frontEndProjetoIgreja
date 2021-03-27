import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import { Form, Table, Listagem } from './styled';
import axios from '../../services/axios';

import Loading from '../../components/Loading';
import history from '../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function Congregacao({ match }) {
  const dispath = useDispatch();
  const id = get(match, 'params.id', '');

  const [descricao, setDescricao] = useState('');
  const [descricaoList, setDescricaoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/setor');
      console.log(response.data);
      setDescricaoList(response.data);
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
        const response = await axios.post('/setor', { descricao });
        console.log(response);
        const novaLista = await axios.get('/setor');
        setDescricaoList(novaLista.data);
        setDescricao('');
        toast.success('Congregação criada com sucesso');

        setIsLoading(false);
      } else {
        const response = await axios.put(`/setor/${id}`, { descricao });
        console.log(response);
        const novaLista = await axios.get('/setor');
        setDescricaoList(novaLista.data);
        setDescricao('');
        toast.success('Congregação editado com sucesso');

        history.push('/congregacao');
        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir a Congregação');
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
  const handleDelete = async (e, idDado, index) => {
    e.persist();
    try {
      setIsLoading(true);
      await axios.delete(`/setor/${idDado}`);
      const novosFuncoes = [...descricaoList];
      novosFuncoes.splice(index, 1);
      setDescricaoList(novosFuncoes);
      toast.success('Congregação excluida com sucesso');

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
      <h1>{id ? 'Editar Congregação' : 'Nova Congregação'}</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <label htmlFor="descricao">
          Nome da setor:
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Congregação"
          />
        </label>
        <button type="submit">Salvar</button>
      </Form>
      <Listagem>
        <h3>Lista de congregação</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Descição</th>
                <th scope="col">Alterar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {descricaoList.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.descricao}</td>
                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.descricao);
                        history.push(`/congregacao/${dado.id}/edit`);
                      }}
                      to={`/congregacao/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={handleDeleteAsk}
                      to={`/congregacao/${dado.id}/delete`}
                    >
                      <FaWindowClose size={16} />
                    </Link>
                    <FaExclamation
                      onClick={(e) => handleDelete(e, dado.id, index)}
                      size={16}
                      display="none"
                      cursor="pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
    </Container>
  );
}
Congregacao.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
