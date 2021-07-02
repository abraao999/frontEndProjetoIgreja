/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes, { string } from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaRegListAlt, FaSearch } from 'react-icons/fa';

import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import { Form, Table, Listagem } from './styled';
import axios from '../../services/axios';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import history from '../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function ListAluno({ match }) {
  const dispath = useDispatch();
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');
  const [msg, setMsg] = useState(true);
  const [filtro, setFiltro] = useState(false);
  const [classes, setClasses] = useState([]);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const [congregacaoId, setCongregacaoId] = useState(
    'Selecione uma congregação'
  );

  const [aluno, setAluno] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/classe');
      setClasses(response.data);
      const response2 = await axios.get('/aluno');
      setAluno(response2.data);
      setIsLoading(false);
    }
    getData();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];
    if (descricao.length > 1) {
      aluno.map((dados) => {
        if (String(dados.nome).toLowerCase().includes(String(descricao))) {
          novaLista.push(dados);
        }
      });
    } else {
      console.log(filtro);
      if (!filtro) {
        aluno.map((dados) => {
          if (dados.classe_id === setorSeletected) {
            novaLista.push(dados);
          }
        });
        setFiltro(true);
      } else {
        const response = await axios.get('/aluno');
        response.data.map((dados) => {
          if (dados.classe_id === setorSeletected) {
            novaLista.push(dados);
          }
        });
      }
    }
    setAluno(novaLista);
    setIsLoading(false);
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
      await axios.delete(`/aluno/${idParaDelecao}`);
      const novaList = [...aluno];
      novaList.splice(indiceDelecao, 1);
      setAluno(novaList);
      toast.success('Aluno excluido com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir um aluno');
      }
      setIsLoading(false);
    }
  };
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);

    classes.map((dado) => {
      if (nome === dado.descricao) setSetorSeletected(dado.id);
    });
  };
  return (
    <Container>
      <h1>{id ? 'Editar Aluno' : 'Novo Aluno'}</h1>
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
              {classes.map((dado) => (
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
                <th scope="col">Nº Ficha</th>
                <th scope="col">Nome</th>
                <th scope="col">Telefone</th>
                <th scope="col">Classe</th>
                <th scope="col">Detalhes</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {aluno.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.id}</td>
                  <td>{dado.nome}</td>
                  <td>{dado.telefone}</td>
                  <td>{dado.desc_classes}</td>
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
                        history.push(`/cadAluno/${dado.id}/edit`);
                      }}
                      to={`/cadAluno/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/listMembros"
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
ListAluno.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
