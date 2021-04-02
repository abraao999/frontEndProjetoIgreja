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

export default function CadMembro({ match }) {
  const dispath = useDispatch();
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState(true);

  const [setores, setSetores] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const [comboBoxCongregacao, setComboBoxCongregacao] = useState(
    'Selecione uma congregação'
  );
  const [nomeMembro, setNomeMembro] = useState('');
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataBatismo, setDataBatismo] = useState('');
  const [estacoCivil, setEstacoCivil] = useState('');
  const [profissao, setProfissao] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargo, setCargo] = useState('');
  const [cargoId, setCargoId] = useState(0);
  const [functionNome, setFunctionNome] = useState('');
  const [functionId, setFunctionId] = useState(0);
  const [setor, setSetor] = useState('');
  const [setorId, setSetorId] = useState(0);

  const [departamento, setDepartamento] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [descricaoList, setDescricaoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const listEstadoCivil = [
    { id: 1, descricao: 'Solteiro(a)' },
    { id: 2, descricao: 'Casado(a)' },
    { id: 3, descricao: 'Viúvo(a)' },
    { id: 4, descricao: 'Divorciado(a)' },
  ];
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get(`/membro/${id}`);
      setNomeMembro(response.data.nome);
      setRg(response.data.rg);
      setCpf(response.data.cpf);
      setTelefone(response.data.telefone);
      setEstacoCivil(response.data.estado_civil);
      setProfissao(response.data.profissao);
      setCargoId(response.data.cargo_id);
      setFunctionId(response.data.function_id);
      setSetorId(response.data.setor_id);
      const response4 = await axios.get('/funcao');
      setFuncoes(response4.data);
      const response2 = await axios.get('/setor');
      setSetores(response2.data);
      const response3 = await axios.get('/cargo');
      setCargos(response3.data);
      setIsLoading(false);
    }
    getData();
  }, []);
  const limpaCampos = () => {
    setNomeMembro('');
    setRg('');
    setCpf('');
    setDataBatismo('');
    setTelefone('');
    setEstacoCivil('');
    setProfissao('');
    setSetor('Selecione a Congregação');
    setFunctionNome('Selecione a função');
    setCargo('Selecione o cargo');
    setFunctionId(0);
    setSetorId(0);
    setCargoId(0);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formErrors = false;

    if (
      nomeMembro.length < 3 ||
      rg.length < 3 ||
      cpf.length < 11 ||
      telefone.length < 11 ||
      estacoCivil.length < 3 ||
      profissao.length < 3 ||
      setorId === 0 ||
      functionId === 0 ||
      cargoId === 0
    ) {
      formErrors = true;
      setIsLoading(false);
      toast.error('Preencha todos os campos');
    }
    if (formErrors) return;
    try {
      if (!id) {
        const response = await axios.post(`membro`, {
          nome: nomeMembro,
          rg,
          cpf,
          data_batismo: dataBatismo || null,
          profissao,
          estado_civil: estacoCivil,
          telefone,
          email,
          password,
          cargo_id: cargoId,
          function_id: functionId,
          setor_id: setorId,
        });
        console.log(response);
        limpaCampos();
        toast.success('Membro criado com sucesso');
        history.push('/listMembros');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/membro/${id}`, {
          nome: nomeMembro,
          rg,
          cpf,
          data_batismo: dataBatismo || null,
          profissao,
          estado_civil: estacoCivil,
          telefone,
          cargo_id: cargoId,
          function_id: functionId,
          setor_id: setorId,
        });
        console.log(response);
        limpaCampos();
        toast.success('Membro editado com sucesso');

        history.push(`/cadMembro/${id}/edit`);
        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir uma Classe');
      }
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    setShow(false);
  };

  const handleFunctionConfirm = async () => {};
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setSetor(e.target.value);
    setores.map((dado) => {
      if (nome === dado.descricao) setSetorId(dado.id);
    });
  };
  const handleGetIdFuncao = (e) => {
    const nome = e.target.value;
    setFunctionNome(e.target.value);
    funcoes.map((dado) => {
      if (nome === dado.descricao) setFunctionId(dado.id);
    });
  };
  const handleGetIdCargo = (e) => {
    const nome = e.target.value;
    setCargo(e.target.value);
    cargos.map((dado) => {
      if (nome === dado.descricao) setCargoId(dado.id);
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
      <h1> Novo Membro</h1>
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
          <label htmlFor="rg">
            RG:
            <input
              id="rg"
              type="text"
              value={rg}
              onChange={(e) => {
                setRg(e.target.value);
                handleInput(e, 'rg');
              }}
              placeholder="RG"
            />
            <small>Minimo de 3 caracteres</small>
          </label>
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
        </div>
        <div>
          <label htmlFor="dataBatismo">
            Data de Batismo:
            <input
              id="dataBatismo"
              type="date"
              value={dataBatismo}
              onChange={(e) => {
                setDataBatismo(e.target.value);
                handleInput(e, 'dataBatismo');
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
            title="Estado Civil"
            list={listEstadoCivil}
            text="Selecione o estado civil"
            value={estacoCivil}
            onChange={(e) => setEstacoCivil(e.target.value)}
          />
          <label htmlFor="profissao">
            Profissão:
            <input
              id="profissao"
              type="text"
              value={profissao}
              onChange={(e) => {
                setProfissao(e.target.value);
                handleInput(e, 'profissao');
              }}
              placeholder="Insira a profissão"
            />
            <small>Insira uma data valida</small>
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
            title="Selecione a função"
            list={funcoes}
            value={functionNome}
            onChange={handleGetIdFuncao}
          />
          <ComboBox
            title="Selecione a cargo"
            list={cargos}
            value={cargo}
            onChange={handleGetIdCargo}
          />
        </div>
        <div>
          <label htmlFor="email">
            E-mail:
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInput(e, 'email');
              }}
              placeholder="exemplo@email.com"
            />
            <small>Insira um e-mail válido</small>
          </label>
          <label htmlFor="password">
            Senha:
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handleInput(e, 'password');
              }}
              placeholder="Senha"
            />
            <small>Minimo de 3 caracteres</small>
          </label>
        </div>

        <button type="submit">Salvar</button>
      </Form>
    </Container>
  );
}
CadMembro.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
