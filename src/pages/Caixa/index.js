/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import axios from '../../services/axios';
import ComboBox from '../../components/ComboBox';
import Loading from '../../components/Loading';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

// import * as actions from '../../store/modules/auth/actions';

export default function Caixa({ match }) {
  const dispath = useDispatch();
  const id = get(match, 'params.id', '');

  const [maxId, setMaxId] = useState(0);

  const [setorId, setSetorId] = useState('');
  const [setor, setSetor] = useState('');
  const [setores, setSetores] = useState([]);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const [comboBoxCongregacao, setComboBoxCongregacao] = useState(
    'Selecione uma congregação'
  );

  const [tipoMovimentacaoBox, setTipoMovimentacaoBox] = useState('');
  const [tipoMovimentacao, setTipoMovimentacao] = useState();
  const [valor, setValor] = useState('');
  const [dataMovimentacao, setDataMovimentacao] = useState('');

  const [departmanetoId, setDepartamentoId] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [departamentos, setDepartamentos] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      if (!id) {
        const dado = await axios.get('/caixa/maxId');
        setMaxId(dado.data + 1);
      } else {
        const dado = await axios.get(`/caixa/${id}`);
        setDescricao(dado.data.descricao);
        setValor(dado.data.valor);
        setTipoMovimentacao(dado.data.tipo);
        setDataMovimentacao(dado.data.data_operacao);
        setSetorId(dado.data.setor_id);
        setDepartamentoId(dado.data.departamento_id);
      }
      const response = await axios.get('/setor');
      setSetores(response.data);
      const response2 = await axios.get('/departamento');
      setDepartamentos(response2.data);
      setIsLoading(false);
    }
    getData();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formErrors = false;

    if (descricao.length < 3 || descricao.length > 255) {
      formErrors = true;
      setIsLoading(false);
      toast.error('Preencha todos os campos');
    }
    if (formErrors) return;
    try {
      if (!id) {
        const response = await axios.post('/caixa', {
          descricao,
          valor,
          tipo: tipoMovimentacao,
          data_operacao: dataMovimentacao,
          setor_id: setorId,
          departamento_id: departmanetoId,
        });
        console.log(response);
        setDescricao('');
        setSetorSeletected(0);
        setComboBoxCongregacao('');
        toast.success('Departamento criada com sucesso');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/caixa/${id}`, {
          descricao,
          valor,
          tipo: tipoMovimentacao,
          data_operacao: dataMovimentacao,
          setor_id: setorId,
          departamento_id: departmanetoId,
        });
        console.log(response);
        setDescricao('');
        setSetorSeletected(0);
        setComboBoxCongregacao('Selecione uma congregação');
        toast.success('Departamento editada com sucesso');

        history.push('/relatorioCaixa');
        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
        dispath(actions.loginFailure());
      } else {
        toast.error('Erro ao excluir uma Classe');
      }
      setIsLoading(false);
    }
  }

  const handleTipoMovimentacao = (e) => {
    const nome = e.target.value;
    setTipoMovimentacaoBox(e.target.value);
    if (nome === 'entrada') setTipoMovimentacao(true);
    else setTipoMovimentacao(false);
  };
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setSetor(e.target.value);
    setores.map((dado) => {
      if (nome === dado.descricao) setSetorId(dado.id);
    });
  };
  const handleGetIdDepartamento = (e) => {
    const nome = e.target.value;
    setDepartamento(e.target.value);
    departamentos.map((dado) => {
      if (nome === dado.descricao) setDepartamentoId(dado.id);
    });
  };
  const handleInput = (e, idTag) => {
    const element = document.getElementById(idTag);
    const next = e.currentTarget.nextElementSibling;

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
      <h1>Caixa</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">
            R.F.:
            {id ? (
              <input id="id" type="text" value={id} disabled />
            ) : (
              <input id="maxId" type="text" value={maxId} disabled />
            )}
          </label>

          <label htmlFor="descricao">
            Descrição
            <input
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => {
                handleInput(e, 'input');
                setDescricao(e.target.value);
              }}
              placeholder="Descricao"
            />
            <small>Minimo de 3 caracteres</small>
          </label>
          <label htmlFor="valor">
            Valor
            <input
              id="valor"
              type="number"
              value={valor}
              onChange={(e) => {
                setValor(e.target.value);
              }}
            />
            <small>Minimo de 3 caracteres</small>
          </label>
        </div>
        <div>
          <label htmlFor="dataBatismo">
            Data da operação:
            <input
              id="dataBatismo"
              type="date"
              value={dataMovimentacao}
              onChange={(e) => {
                setDataMovimentacao(e.target.value);
              }}
            />
          </label>
          <label htmlFor="congregacao">
            Tipo de movimentação
            <select
              onChange={handleTipoMovimentacao}
              value={tipoMovimentacaoBox}
            >
              <option value="nada">Escolha um tipo de movimentação</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
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
            title="Selecione o departamento"
            list={departamentos}
            value={departamento}
            onChange={handleGetIdDepartamento}
          />
        </div>

        <button type="submit">Salvar</button>
      </Form>
    </Container>
  );
}
Caixa.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
