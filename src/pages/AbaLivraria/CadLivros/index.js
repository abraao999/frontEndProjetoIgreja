/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import { isDate } from 'validator';
import { get } from 'lodash';
import { Row, Form, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Container } from '../../../styles/GlobalStyles';
import axios from '../../../services/axios';

import Loading from '../../../components/Loading';
import history from '../../../services/history';
import ComboBox from '../../../components/ComboBox';
import { Label } from './styled';
// import * as actions from '../../store/modules/auth/actions';

export default function CadLivrariaLivros({ match }) {
  const id = get(match, 'params.id', '');
  const [setores, setSetores] = useState([]);
  const [classes, setClasses] = useState([]);

  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valor, setValor] = useState('');

  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  const [dataNascimento, setDataNascimento] = useState('');

  const [setor, setSetor] = useState('');
  const [setorId, setSetorId] = useState(0);
  const [classe, setClasse] = useState('');
  const [classeId, setClasseId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [visitante, setVisitante] = useState(false);
  const dataStorage = useSelector((state) => state.auth);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      // if (!id) {
      //   // const dado = await axios.get('/aluno/maxId');
      //   // setMaxId(dado.data + 1);
      // } else {
      //   const response = await axios.get(`/aluno/${id}`);
      //   setDescricao(response.data.descricao);
      //   setCpf(response.data.cpf);
      //   setTelefone(response.data.telefone);
      //   setSetorId(response.data.setor_id);
      //   setClasseId(response.data.classe_id);
      //   if (response.data.visitante) setVisitante(true);
      //   const dataform = new Date(response.data.data_aniversario);
      //   const dataform2 = `${dataform.getFullYear()}/${dataform.getMonth()}/${dataform.getDate()}`;
      //   setDataNascimento(dataform2);
      // }
      // const response2 = await axios.get('/setor');
      // const lista = [];
      // setSetores(response2.data);

      setIsLoading(false);
    }
    getData();
  }, [id]);
  const limpaCampos = () => {
    setDescricao('');
    setCpf('');
    setDataNascimento('');
    setTelefone('');
    setSetor('Selecione a Congregação');
    setSetorId(0);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formErrors = false;

    if (
      descricao.length < 3 ||
      cpf.length < 11 ||
      telefone.length < 11 ||
      setorId === 0
    ) {
      formErrors = true;
      setIsLoading(false);
      toast.error('Preencha todos os campos');
    }
    if (formErrors) return;
    try {
      if (!id) {
        const response = await axios.post(`livrariaLivros`, {
          descricao,
          cpf,
          visitante,
          data_aniversario: dataNascimento || null,
          telefone,
          setor_id: setorId,
          classe_id: classeId,
        });
        console.log(response);
        limpaCampos();
        toast.success('Livro criado com sucesso');
        history.push('/listAluno');
        setIsLoading(false);
      } else {
        console.log({
          descricao,
          cpf,
          visitante,
          data_aniversario: dataNascimento || null,
          telefone,
          setor_id: setorId,
          classe_id: classeId,
          id,
        });
        const response = await axios.put(`/aluno/${id}`, {
          nome: nomeMembro,
          cpf,
          visitante,
          data_aniversario: dataNascimento,
          telefone,
          setor_id: setorId,
          classe_id: classeId,
        });
        console.log(response);
        // limpaCampos();
        toast.success('Aluno editado com sucesso');

        // history.push(`/cadAluno/${id}/edit`);
        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao adicionar um Aluno');
      }
      setIsLoading(false);
    }
  }

  const handleInput = (e, idTag) => {
    const element = document.getElementById(idTag);
    const next = e.currentTarget.nextElementSibling;
    if (idTag === 'dataBatismo')
      if (!isDate(e.target.value)) {
        next.setAttribute('style', 'display:block');
        return;
      }

    if (e.target.value.length < 3) {
      element.setAttribute('style', 'border-color:red');
      next.setAttribute('style', 'display:block');
      element.style.borderWidth = '2px';
    } else {
      element.removeAttribute('style');
      next.removeAttribute('style');
    }
  };
  return (
    <Container>
      <h1> {id ? 'Editar Livro' : 'Novo Livro'}</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={12} className="my-1">
            <Form.Label htmlFor="nome">Nome do livro:</Form.Label>
            <Form.Control
              id="descricao"
              type="text"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value.toLocaleUpperCase());
                handleInput(e, 'descricao');
              }}
              placeholder="Nome do livro"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="quantidade">Quantidade:</Form.Label>
            <Form.Control
              id="quantidade"
              type="number"
              value={quantidade}
              onChange={(e) => {
                setQuantidade(e.target.value.toLocaleUpperCase());
                handleInput(e, 'quantidade');
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="nome">Valor:</Form.Label>
            <Form.Control
              id="valor"
              type="number"
              value={valor}
              onChange={(e) => {
                setValor(e.target.value.toLocaleUpperCase());
                handleInput(e, 'valor');
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>

          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="dataNascimento">
              Data de Nascimento:
            </Form.Label>
            <Form.Control
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => {
                setDataNascimento(e.target.value);
                handleInput(e, 'dataNascimento');
              }}
            />
            <Form.Control.Feedback type="invalid">
              Insira uma data valida
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }} className="align-items-center">
          <button type="submit">Salvar</button>
        </Row>
      </Form>
    </Container>
  );
}
CadLivrariaLivros.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
