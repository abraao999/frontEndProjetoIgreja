import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';

import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import ModalMembro from '../../components/ModalMembro';

export default function EditPass() {
  const dispath = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeMembro, setNomeMembro] = useState('');
  const [idMembro, setIdMembro] = useState('');
  const [show, setShow] = useState(false);
  const [membros, setMembros] = useState([]);
  const [id, setId] = useState('');
  const nomeStorage = useSelector((state) => state.auth.user.nome);
  const emailStorage = useSelector((state) => state.auth.user.email);
  const isLoading = useSelector((state) => state.auth.isLoading);

  async function handleSubmit(e) {
    e.preventDefault();

    let formErrors = false;

    if (nomeMembro.length < 3 || nomeMembro.length > 255) {
      formErrors = true;
      toast.error('Campo nome deve ter entre 3 e 255 caracteres');
    }
    if (!isEmail(email)) {
      formErrors = true;
      toast.error('E-mail invalido');
    }
    if (!id && (password.length < 6 || password.length > 50)) {
      formErrors = true;
      toast.error('Campo senha deve ter entre 6 e 50 caracteres');
    }
    if (formErrors) return;
    try {
      const response = axios.put(`/membro/${idMembro}`, {
        email,
        password,
      });
    } catch (er) {
      toast.error('Erro ao alterar a senha');
    }
    // dispath(actions.registerRequest({ nome, email, password, id }));
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
      <h1>{id ? 'Editar dados' : 'Crie sua conta'}</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="id">Código Membro:</Form.Label>

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
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Nome do Membro</Form.Label>

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
          </Col>
          <Col sm={12} md={3} className="my-1">
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
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Senha</Form.Label>

            <Form.Control
              id="input"
              type="text"
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
