import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose } from 'react-icons/fa';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import { Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';

import Loading from '../../../components/Loading';
import history from '../../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function Congregacao({ match }) {
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

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
      await axios.delete(`/setor/${idParaDelecao}`);
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
  return (
    <Container>
      <h1>{id ? 'Editar Congregação' : 'Nova Congregação'}</h1>
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
        <Row className="align-items-center">
          <Col sm={12} md={12} className="my-1">
            <Form.Label htmlFor="descricao">Nome da congregação:</Form.Label>

            <Form.Control
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Congregação"
            />
          </Col>
        </Row>
        <Row>
          <button type="submit">Salvar</button>
        </Row>
      </Form>
      <Listagem>
        <h3>Lista de congregações</h3>
        <center>
          <Table responsive striped bordered hover>
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
                      onClick={() => handleShow(dado.id, index)}
                      to={`/congregacao/${dado.id}/delete`}
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
Congregacao.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
