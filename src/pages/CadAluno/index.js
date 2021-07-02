/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import InputMask from 'react-input-mask';
import { isEmail, isDate } from 'validator';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import axios from '../../services/axios';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import history from '../../services/history';
import ComboBox from '../../components/ComboBox';
// import * as actions from '../../store/modules/auth/actions';

export default function CadAluno({ match }) {
  const dispath = useDispatch();
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);

  const [maxId, setMaxId] = useState(0);
  const [setores, setSetores] = useState([]);
  const [classes, setClasses] = useState([]);

  const [nomeMembro, setNomeMembro] = useState(' ');

  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  const [dataNascimento, setDataNascimento] = useState('');

  const [setor, setSetor] = useState('');
  const [setorId, setSetorId] = useState(0);
  const [classe, setClasse] = useState('');
  const [classeId, setClasseId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      if (!id) {
        // const dado = await axios.get('/aluno/maxId');
        // setMaxId(dado.data + 1);
      } else {
        const response = await axios.get(`/aluno/${id}`);
        setNomeMembro(response.data.nome);
        setCpf(response.data.cpf);
        setTelefone(response.data.telefone);
        setSetorId(response.data.setor_id);
        setClasseId(response.data.classe_id);
      }
      const response2 = await axios.get('/setor');
      setSetores(response2.data);
      const response3 = await axios.get('/classe');
      setClasses(response3.data);
      setIsLoading(false);
    }
    getData();
  }, [id]);
  const limpaCampos = () => {
    setNomeMembro('');
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
      nomeMembro.length < 3 ||
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
        const response = await axios.post(`aluno`, {
          nome: nomeMembro,
          cpf,
          data_aniversario: dataNascimento || null,
          telefone,
          setor_id: setorId,
          classe_id: classeId,
        });
        console.log(response);
        // limpaCampos();
        toast.success('Membro criado com sucesso');
        // history.push('/listMembros');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/aluno/${id}`, {
          nome: nomeMembro,
          cpf,
          data_aniversario: dataNascimento || null,
          telefone,
          setor_id: setorId,
          classe_id: classeId,
        });
        console.log(response);
        limpaCampos();
        toast.success('Membro editado com sucesso');

        history.push(`/cadAluno/${id}/edit`);
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

  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setSetor(e.target.value);
    setores.map((dado) => {
      if (nome === dado.descricao) setSetorId(dado.id);
    });
  };
  const handleGetIdClasse = (e) => {
    const nome = e.target.value;
    setClasse(e.target.value);
    classes.map((dado) => {
      if (nome === dado.descricao) setClasseId(dado.id);
    });
  };

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
      <h1> Novo Aluno</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <div>
          {/* <label htmlFor="id">
            R.A:
            {id ? (
              <input id="id" type="text" value={id} disabled />
            ) : (
              <input id="maxId" type="text" value={maxId} disabled />
            )}
          </label> */}
          <label htmlFor="nome">
            Nome completo:
            <input
              id="nome"
              type="text"
              value={nomeMembro}
              onChange={(e) => {
                setNomeMembro(e.target.value);
                handleInput(e, 'nome');
              }}
              placeholder="Nome"
            />
            <small>Minimo de 3 caracteres</small>
          </label>
        </div>
        <div>
          <label htmlFor="cpf">
            CPF:
            <InputMask
              mask="999.999.999-99"
              id="cpf"
              type="text"
              value={cpf}
              onChange={(e) => {
                setCpf(e.target.value);
                handleInput(e, 'cpf');
              }}
              placeholder="000.000.000-00"
            />
            <small>Minimo de 3 caracteres</small>
          </label>

          <label htmlFor="dataNascimento">
            Data de Nascimento:
            <input
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => {
                setDataNascimento(e.target.value);
                handleInput(e, 'dataNascimento');
              }}
            />
            <small>Insira uma data valida</small>
          </label>
          <label htmlFor="telefone">
            Celular:
            <InputMask
              mask="(99) 99999-9999"
              id="telefone"
              type="text"
              value={telefone}
              onChange={(e) => {
                setTelefone(e.target.value);
                handleInput(e, 'telefone');
              }}
              placeholder="(00) 00000-0000"
            />
            <small>Insira um número válido</small>
          </label>
        </div>

        <div>
          <ComboBox
            title="Selecione a Congregação"
            list={setores}
            value={setor}
            onChange={handleGetIdCongregacao}
          />
          <ComboBox
            title="Selecione o cargo"
            list={classes}
            value={classe}
            onChange={handleGetIdClasse}
          />
        </div>

        <button type="submit">Salvar</button>
      </Form>
    </Container>
  );
}
CadAluno.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
