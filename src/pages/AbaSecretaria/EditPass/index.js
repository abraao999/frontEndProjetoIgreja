import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';

import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import Loading from '../../../components/Loading';
import axios from '../../../services/axios';
import ModalMembro from '../../../components/ModalMembro';
import history from '../../../services/history';

export default function EditPass() {
  const dispath = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeMembro, setNomeMembro] = useState('');
  const [idMembro, setIdMembro] = useState('');
  const [show, setShow] = useState(false);
  const [membros, setMembros] = useState([]);
  const [id, setId] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/membro/${idMembro}`, {
        nome: nomeMembro,
        email,
        password,
      });
      console.log(response);
      toast.success('Alterada com sucesso');
      history.push('/home');
    } catch (er) {
      toast.error('Erro ao alterar a senha');
    }

    // dispath(actions.registerRequest({ nome, email, password, id }));
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
      <h1>Editar senha</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
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
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">E-mail</Form.Label>

            <Form.Control
              id="input"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email"
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Senha</Form.Label>

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
        <button type="submit">Salvar</button>
      </Form>
    </Container>
  );
}
