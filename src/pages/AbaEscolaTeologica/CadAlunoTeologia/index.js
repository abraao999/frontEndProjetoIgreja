/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import InputMask from 'react-input-mask';
import { isDate } from 'validator';
import { get } from 'lodash';
import { AiOutlineImport } from 'react-icons/ai';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import { Header, Label } from './styled';
import axios from '../../../services/axios';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
import ComboBox from '../../../components/ComboBox';
// import * as actions from '../../store/modules/auth/actions';
export default function CadAlunoTeologia({ match }) {
  const id = get(match, 'params.id', '');

  const [validated, setValidated] = useState(false);

  const [nomeMembro, setNomeMembro] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cidadeNascimento, setCidadeNascimento] = useState('');
  const [estadoNascimento, setEstadoNascimento] = useState('');
  const [estacoCivil, setEstacoCivil] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [escolaridade, setEscolaridade] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [classe, setClasse] = useState('');
  const [classeId, setClasseId] = useState('');
  const [classes, setClasses] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const listEstadoCivil = [
    { id: 1, descricao: 'Solteiro(a)' },
    { id: 2, descricao: 'Casado(a)' },
    { id: 3, descricao: 'Viúvo(a)' },
    { id: 4, descricao: 'Divorciado(a)' },
  ];
  const listEscolaridade = [
    { id: 1, descricao: 'Esino Fundamental Incompleto' },
    { id: 2, descricao: 'Esino Fundamental Completo' },
    { id: 3, descricao: 'Esino Médio Incompleto' },
    { id: 4, descricao: 'Esino Médio Completo' },
    { id: 5, descricao: 'Esino Superior Incompleto' },
    { id: 6, descricao: 'Esino Superior Completo' },
  ];
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      if (id) {
        const response = await axios.get(`/teologiaAluno/${id}`);
        console.log(response.data);
        setNomeMembro(response.data.nome);
        setCpf(response.data.cpf);
        setTelefone(response.data.telefone);
        setDataNascimento(response.data.data_nascimento);
        setCidadeNascimento(response.data.cidade_nascimento);
        setEstadoNascimento(response.data.estado_nascimento);
        setEstacoCivil(response.data.estado_civil);
        setNomeMae(response.data.nome_mae);
        setEscolaridade(response.data.escolaridade);
        setCep(response.data.cep);
        setRua(response.data.rua);
        setNumero(response.data.numero);
        setBairro(response.data.bairro);
        setCidade(response.data.cidade);
      }
      const response = await axios.get('/teologiaClasse');
      setClasses(response.data);
      console.log(response.data);
      setIsLoading(false);
    }
    getData();
  }, [id]);
  const limpaCampos = () => {
    setNomeMembro('');
    setCpf('');
    setTelefone('');
    setDataNascimento('');
    setCidadeNascimento('');
    setEstadoNascimento('');
    setEstacoCivil('');
    setNomeMae('');
    setEscolaridade('');
    setCep('');
    setRua('');
    setNumero('');
    setBairro('');
    setCidade('');
  };
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      // e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);

    setIsLoading(true);
    let formErrors = false;

    if (
      nomeMembro.length < 3 ||
      cpf.length < 11 ||
      telefone.length < 11 ||
      estacoCivil.length < 3
    ) {
      formErrors = true;
      setIsLoading(false);
      toast.error('Preencha todos os campos');
    }
    if (formErrors) return;
    try {
      if (!id) {
        await axios.post(`/teologiaAluno`, {
          nome: nomeMembro,
          cpf,
          data_nascimento: dataNascimento || null,
          estado_civil: estacoCivil,
          telefone,
          nome_mae: nomeMae,
          cidade_nascimento: cidadeNascimento,
          estado_nascimento: estadoNascimento,
          escolaridade,
          cep,
          rua,
          numero,
          bairro,
          cidade,
          classe_id: classeId,
        });

        limpaCampos();
        toast.success('Aluno criado com sucesso');
        history.push('/listAlunosTeologia');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/teologiaAluno/${id}`, {
          nome: nomeMembro,
          cpf,
          data_nascimento: dataNascimento || null,
          estado_civil: estacoCivil,
          telefone,
          nome_mae: nomeMae,
          cidade_nascimento: cidadeNascimento,
          estado_nascimento: estadoNascimento,
          escolaridade,
          cep,
          rua,
          numero,
          bairro,
          cidade,
          classe_id: classeId,
        });
        limpaCampos();
        toast.success('Aluno editado com sucesso');

        history.push('/listAlunosTeologia');
        setIsLoading(false);
      }
    } catch (erros) {
      const status = get(erros, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir uma Classe');
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
  const handleGetIdClasse = (e) => {
    const nome = e.target.value;
    setClasse(e.target.value);
    classes.map((dado) => {
      if (nome === dado.descricao) {
        setClasseId(dado.id);
        console.log(dado.id);
      }
    });
  };
  const handleImportaAluno = async (e) => {
    try {
      const response = await axios.get('/membro');
      response.data.map((dados) => {
        if (
          String(dados.cpf).toLowerCase().includes(String(cpf.toLowerCase()))
        ) {
          setNomeMembro(dados.nome);
          setCpf(dados.cpf);
          setTelefone(dados.telefone);
          setDataNascimento(dados.data_nascimento);
          setEstacoCivil(dados.estado_civil);
          setCep(dados.cep);
          setRua(dados.rua);
          setNumero(dados.numero);
          setBairro(dados.bairro);
          setCidade(dados.cidade);
        }
      });
    } catch (er) {
      toast.error('Condigo não existe');
      console.log(er);
    }
  };
  return (
    <Container>
      <Header>
        <h2>Lista de membros</h2>
        <button type="button" onClick={handleImportaAluno}>
          <AiOutlineImport size={35} />
        </button>
      </Header>
      <Loading isLoading={isLoading} />
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="cpf">
              CPF:
              <InputMask
                mask="999.999.999-99"
                id="cpf"
                type="text"
                value={cpf}
                onChange={(e) => {
                  setCpf(e.target.value);
                  // handleInput(e, 'cpf');
                }}
                onBlur={(e) => handleImportaAluno(e)}
                placeholder="000.000.000-00"
              />
              {/* <small>Minimo de 3 caracteres</small> */}
            </Label>
          </Col>
          <Col sm={12} md={8} className="my-1">
            <Form.Label htmlFor="nome">Nome completo:</Form.Label>
            <Form.Control
              id="nome"
              type="text"
              value={nomeMembro}
              onChange={(e) => {
                setNomeMembro(e.target.value.toLocaleUpperCase());
                // handleInput(e, 'nome');
              }}
              placeholder="Nome"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="align-items-center">
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
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira uma data valida
            </Form.Control.Feedback>
          </Col>

          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Cidade de Nascimento:</Form.Label>
            <Form.Control
              id="nomeConjuge"
              type="text"
              value={cidadeNascimento}
              onChange={(e) => {
                setCidadeNascimento(e.target.value.toLocaleUpperCase());
                // handleInput(e, 'nomeConjuge');
              }}
              placeholder="Cidade de Nascimento"
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 4 caracteres
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Estado de Nascimento:</Form.Label>
            <Form.Control
              id="nomeConjuge"
              type="text"
              value={estadoNascimento}
              onChange={(e) => {
                setEstadoNascimento(e.target.value.toLocaleUpperCase());
                // handleInput(e, 'nomeConjuge');
              }}
              placeholder="Estado de Nascimento"
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={8} className="my-1">
            <Form.Label htmlFor="cidade">Nome da Mãe:</Form.Label>
            <Form.Control
              id="nomeConjuge"
              type="text"
              value={nomeMae}
              onChange={(e) => {
                setNomeMae(e.target.value.toLocaleUpperCase());
                // handleInput(e, 'nomeConjuge');
              }}
              placeholder="Nome do Mãe"
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>

          <Col sm={12} md={4} className="my-1">
            <ComboBox
              title="Estado Civil"
              list={listEstadoCivil}
              text="Selecione o estado civil"
              value={estacoCivil}
              onChange={(e) => {
                setEstacoCivil(e.target.value);
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="telefone">
              Celular:
              <InputMask
                mask="(99) 99999-9999"
                id="telefone"
                type="text"
                value={telefone}
                onChange={(e) => {
                  setTelefone(e.target.value);
                  // handleInput(e, 'telefone');
                }}
                placeholder="(00) 00000-0000"
              />
              {/* <small>Insira um número válido</small> */}
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <ComboBox
              title="Escolaridade"
              list={listEscolaridade}
              text="Selecione o estado civil"
              value={escolaridade}
              onChange={(e) => {
                setEscolaridade(e.target.value);
              }}
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <ComboBox
              title="Classe"
              list={classes}
              text="Selecione o estado civil"
              value={classe}
              onChange={(e) => {
                handleGetIdClasse(e);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="cep">
              CEP:
              <InputMask
                mask="99999-999"
                id="telefone"
                type="text"
                value={cep}
                onChange={(e) => {
                  setCep(e.target.value);
                  // handleInput(e, 'telefone');
                }}
                placeholder="15400-000"
              />
              {/* <small>Insira um número válido</small> */}
            </Label>
          </Col>
          <Col sm={12} md={8} className="my-1">
            <Form.Label htmlFor="email">Rua:</Form.Label>
            <Form.Control
              id="rua"
              type="text"
              value={rua}
              onChange={(e) => {
                setRua(e.target.value.toUpperCase());
                // handleInput(e, 'email');
              }}
              placeholder="Nome da rua"
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira um nome de rua válido
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="numero">Número:</Form.Label>
            <Form.Control
              id="numero"
              type="text"
              value={numero}
              onChange={(e) => {
                setNumero(e.target.value);
                // handleInput(e, 'numero');
              }}
              placeholder="Número"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>

          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="bairro">Bairro:</Form.Label>
            <Form.Control
              id="bairro"
              type="text"
              value={bairro}
              onChange={(e) => {
                setBairro(e.target.value.toUpperCase());
                // handleInput(e, 'email');
              }}
              placeholder="Bairro"
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira um nome de rua válido
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Cidade:</Form.Label>
            <Form.Control
              id="cidade"
              type="text"
              value={cidade}
              onChange={(e) => {
                setCidade(e.target.value.toUpperCase());
                // handleInput(e, 'cidade');
              }}
              placeholder="Cidade"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>

        <button type="submit">Salvar</button>
      </Form>
    </Container>
  );
}
CadAlunoTeologia.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
