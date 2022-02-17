/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import { Col, Form, Row } from 'react-bootstrap';
import { get } from 'lodash';
import { Container } from '../../../styles/GlobalStyles';
import Loading from '../../../components/Loading';
import axios from '../../../services/axios';
import ModalMembro from '../../../components/ModalMembro';
import history from '../../../services/history';

export default function EditPass({ match }) {
  const id = get(match, 'params.id', '');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [nomeMembro, setNomeMembro] = useState('');
  const [idMembro, setIdMembro] = useState('');
  const [show, setShow] = useState(false);
  const [membros, setMembros] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      if (id) {
        const dado = await axios.get(`/membro/${id}`);
        setEmail(dado.data.email);
        setNomeMembro(dado.data.nome);
        setDisabled(true);
      }
      setIsLoading(false);
    }
    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confPassword) {
      try {
        if (id) {
          const response = await axios.put(`/membro/${id}`, {
            nome: nomeMembro,
            email,
            password,
          });
        } else {
          const response = await axios.put(`/membro/${idMembro}`, {
            nome: nomeMembro,
            email,
            password,
          });
        }
        toast.success('Alterada com sucesso');
        history.push('/');
      } catch (er) {
        toast.error('Erro ao alterar a senha');
      }
    } else toast.error('As senhas conferem');
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idFuncao, index) => {
    setShow(true);
  };
  const handleIdMembro = async (idm) => {
    try {
      const response = await axios.get(`/membro/${idm}`);
      setNomeMembro(response.data.nome);
      setIdMembro(response.data.id);
      setEmail(response.data.email);
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
      <ModalMembro
        title="Selecione o membro"
        handleClose={handleClose}
        show={show}
        list={membros}
        buttonCancel="Fechar"
        handleIdMembro={handleIdMembro}
      />
      <h2>Altaração de senha</h2>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="descricao">Nome do Membro</Form.Label>

            <Form.Control
              id="input"
              type="text"
              value={nomeMembro}
              onChange={(e) => {
                setNomeMembro(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value.length > 0 && !id) handlePesquisaNome();
              }}
              placeholder="Nome"
              disabled={disabled}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="descricao">E-mail</Form.Label>

            <Form.Control
              id="input"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email"
              disabled={disabled}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="descricao">Digite a Senha</Form.Label>

            <Form.Control
              id="input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Senha"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="descricao">Confirme a Senha</Form.Label>

            <Form.Control
              id="input"
              type="password"
              value={confPassword}
              onChange={(e) => {
                setConfPassword(e.target.value);
              }}
              placeholder="Senha"
            />
          </Col>
        </Row>
        <button type="submit">Salvar</button>
      </Form>
    </Container>
  );
}
EditPass.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
