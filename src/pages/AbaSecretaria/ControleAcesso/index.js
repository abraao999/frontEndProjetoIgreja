/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaSearch } from 'react-icons/fa';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import { Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';

import Loading from '../../../components/Loading';
import history from '../../../services/history';
import ModalMembro from '../../../components/ModalMembro';
// import * as actions from '../../store/modules/auth/actions';

export default function ControleAcesso({ match }) {
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [descricao, setDescricao] = useState('');
  const [descricaoList, setDescricaoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nomeMembro, setNomeMembro] = useState('');
  const [idMembro, setIdMembro] = useState('');
  const [membros, setMembros] = useState([]);
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
        toast.success('Função criada com sucesso');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/funcao/${id}`, { descricao });
        console.log(response);
        const novaLista = await axios.get('/funcao');
        setDescricaoList(novaLista.data);
        setDescricao('');
        toast.success('Função editada com sucesso');

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
      await axios.delete(`/funcao/${idParaDelecao}`);
      const novosFuncoes = [...descricaoList];
      novosFuncoes.splice(indiceDelecao, 1);
      setDescricaoList(novosFuncoes);
      toast.success('Classe excluida com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir a classe');
      }
      setIsLoading(false);
    }
  };
  const handleIdMembro = async (idm) => {
    try {
      const response = await axios.get(`/membro/${idm}`);
      setNomeMembro(response.data.nome);
      setIdMembro(response.data.id);
      handleClose();
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  const handlePesquisaNome = async () => {
    try {
      const novaLista = [];
      const response = await axios.get('/membro');
      response.data.map((dados) => {
        if (
          String(dados.nome)
            .toLowerCase()
            .includes(String(nomeMembro.toLowerCase()))
        ) {
          novaLista.push(dados);
        }
      });
      setMembros(novaLista);
      handleShow();
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  return (
    <Container>
      <h1> Controle de Acesso</h1>
      <Loading isLoading={isLoading} />
      <ModalMembro
        title="Selecione o membro"
        handleClose={handleClose}
        show={show}
        list={membros}
        buttonCancel="Fechar"
        handleIdMembro={handleIdMembro}
      />
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Nome do Membro</Form.Label>

            <Form.Control
              id="input"
              type="text"
              value={nomeMembro}
              onChange={(e) => {
                setNomeMembro(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value.length > 0) handlePesquisaNome();
              }}
              placeholder="Nome"
            />
          </Col>
          <Col
            sm={12}
            md={4}
            className="my-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <button type="submit">
              Buscar <FaSearch />
            </button>
          </Col>
        </Row>
      </Form>
      <Listagem>
        <h3>Lista de Funções</h3>
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
                        history.push(`/funcao/${dado.id}/edit`);
                      }}
                      to={`/funcao/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to={`/funcao/${dado.id}/delete`}
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
ControleAcesso.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
