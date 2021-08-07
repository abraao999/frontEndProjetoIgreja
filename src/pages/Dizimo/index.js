/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { Col, Form, Row } from 'react-bootstrap';
import { Container } from '../../styles/GlobalStyles';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';
import ModalMembro from '../../components/ModalMembro';

// import * as actions from '../../store/modules/auth/actions';

export default function Dizimo({ match }) {
  const dispath = useDispatch();
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);

  const [idMembro, setIdMembro] = useState('');
  const [nomeMembro, setNomeMembro] = useState('');
  const [membros, setMembros] = useState([]);

  const [valor, setValor] = useState('');
  const [dataMovimentacao, setDataMovimentacao] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      if (id) {
        const dado = await axios.get(`/dizimo/${id}`);
        console.log(dado.data);
        setValor(dado.data.valor);
        setDataMovimentacao(dado.data.data_operacao);
        console.log('babana');

        setNomeMembro(dado.data.nome);
        setIdMembro(dado.data.membro_id);
      }
      setIsLoading(false);
    }
    getData();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formErrors = false;

    if (nomeMembro.length < 3 || nomeMembro.length > 255 || !dataMovimentacao) {
      formErrors = true;
      setIsLoading(false);
      toast.error('Preencha todos os campos');
    }
    if (formErrors) return;
    try {
      if (!id) {
        const response = await axios.post('/dizimo', {
          membro_id: idMembro,
          valor,
          data_operacao: dataMovimentacao,
        });
        setNomeMembro('');
        setValor('');
        setIdMembro('');
        toast.success('Dízimo inserido com sucesso');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/dizimo/${id}`, {
          valor,
          data_operacao: dataMovimentacao,
        });
        toast.success('Dízimo editada com sucesso');

        history.push('/relatorioDizimo');
        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
        dispath(actions.loginFailure());
      } else {
        toast.error('Erro ao inseriro dizimo');
      }
      setIsLoading(false);
    }
  }
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idFuncao, index) => {
    setShow(true);
  };

  const handleIdMembro = async (idm) => {
    try {
      const response = await axios.get(`/membro/${idm}`);
      console.log(response.data);
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

      console.log(novaLista);
      setMembros(novaLista);
      handleShow();
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  return (
    <Container>
      <ModalMembro
        title="Selecione o membro"
        handleClose={handleClose}
        show={show}
        list={membros}
        buttonCancel="Fechar"
        handleIdMembro={handleIdMembro}
      />
      <h1>Dizimo</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="id">Código Membro:</Form.Label>
            {!id ? (
              <Form.Control
                id="id"
                onChange={(e) => {
                  setIdMembro(e.target.value);
                }}
                onBlur={(e) => {
                  if (e.target.value.length > 0) handleIdMembro(e.target.value);
                }}
                type="text"
                value={idMembro}
              />
            ) : (
              <Form.Control disabled type="text" value={idMembro} />
            )}
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Nome do Membro</Form.Label>
            {!id ? (
              <Form.Control
                id="input"
                type="text"
                value={nomeMembro}
                onChange={(e) => {
                  setNomeMembro(e.target.value);
                }}
                onBlur={(e) => {
                  if (!idMembro && e.target.value.length > 0)
                    handlePesquisaNome();
                }}
                placeholder="Nome"
              />
            ) : (
              <Form.Control type="text" value={nomeMembro} disabled />
            )}
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="valor">Valor</Form.Label>
            <Form.Control
              id="valor"
              type="number"
              value={valor}
              onChange={(e) => {
                setValor(e.target.value);
              }}
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataMovimentacao">
              Data da operação:
            </Form.Label>
            <Form.Control
              id="dataMovimentacao"
              type="date"
              value={dataMovimentacao}
              onChange={(e) => {
                setDataMovimentacao(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <button type="submit">Salvar</button>
        </Row>
      </Form>
    </Container>
  );
}
Dizimo.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
