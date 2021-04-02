/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes, { string } from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaRegListAlt, FaSearch } from 'react-icons/fa';

import { useDispatch } from 'react-redux';
import { get, isEqual } from 'lodash';
import { Link } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import { Form, Table, Listagem } from './styled';
import axios from '../../services/axios';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import history from '../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function ListMembros({ match }) {
  const dispath = useDispatch();
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');
  const [msg, setMsg] = useState(true);

  const [setores, setSetores] = useState([]);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const [congregacaoId, setCongregacaoId] = useState(
    'Selecione uma congregação'
  );

  const [departamento, setDepartamento] = useState([]);
  const [membros, setMembros] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [descricaoList, setDescricaoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/setor');
      setSetores(response.data);
      const response2 = await axios.get('/membro');
      setMembros(response2.data);
      setIsLoading(false);
    }
    getData();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];
    if (descricao.length > 1) {
      membros.map((dados) => {
        if (String(dados.nome).toLowerCase().includes(String(descricao))) {
          novaLista.push(dados);
        }
      });
    } else {
      membros.map((dados) => {
        if (dados.setor_id === setorSeletected) {
          novaLista.push(dados);
        }
      });
    }
    setIsLoading(false);
    setMembros(novaLista);

    // setCongregacaoId('Selecione uma congregação');
  }

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idFuncao, index) => {
    setIdParaDelecao(idFuncao);
    setIndiceDelecao(index);
    setShow(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/departamento/${idParaDelecao}`);
      const novosFuncoes = [...departamento];
      novosFuncoes.splice(indiceDelecao, 1);
      setDepartamento(novosFuncoes);
      toast.success('Departamento excluida com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir a departamento');
      }
      setIsLoading(false);
    }
  };
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);
    setores.map((dado) => {
      if (nome === dado.descricao) setSetorSeletected(dado.id);
    });
  };
  return (
    <Container>
      <h1>{id ? 'Editar Departamento' : 'Novo Departamento'}</h1>
      <Loading isLoading={isLoading} />
      <Modal
        title="Atenção!!!"
        handleClose={handleClose}
        show={show}
        text="Deseja exluir esse registro"
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleFunctionConfirm}
      />

      <Form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="descricao">
            Insira um nome para filtrar:
            <input
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
              }}
              placeholder="Nome para filtro"
            />
          </label>

          <label htmlFor="congregacao">
            Filtrar por congregação
            <select onChange={handleGetIdCongregacao} value={congregacaoId}>
              <option value="nada">Selecione a congregação</option>
              {setores.map((dado) => (
                <option key={dado.id} value={dado.descricao}>
                  {dado.descricao}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit">
          Filtrar <FaSearch />
        </button>
      </Form>
      <Listagem>
        <h3>Lista de Membros</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Telefone</th>
                <th scope="col">Congregação</th>
                <th scope="col">Cargo</th>
                <th scope="col">Detalhes</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {membros.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.nome}</td>
                  <td>{dado.telefone}</td>
                  <td>{dado.desc_setor}</td>
                  <td>{dado.desc_cargo}</td>
                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.dep_descricao);
                        history.push(`/detailtMembro/${dado.id}`);
                      }}
                      to={`/detailtMembro/${dado.id}`}
                    >
                      <FaRegListAlt size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.dep_descricao);
                        history.push(`/departamento/${dado.dep_id}/edit`);
                      }}
                      to={`/departamento/${dado.dep_id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.dep_id, index)}
                      to={`/departamento/${dado.dep_id}/delete`}
                    >
                      <FaWindowClose size={16} />
                    </Link>
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
ListMembros.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
