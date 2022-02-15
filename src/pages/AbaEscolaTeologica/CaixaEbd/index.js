/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { Col, Form, Row } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import axios from '../../../services/axios';
import ComboBox from '../../../components/ComboBox';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
import * as actions from '../../../store/modules/auth/actions';
import { Label } from './styled';
// import * as actions from '../../store/modules/auth/actions';

export default function CaixaEbd({ match }) {
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

  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      if (id) {
        const dado = await axios.get(`/caixa/${id}`);
        setDescricao(dado.data.descricao);
        setValor(dado.data.valor);
        setTipoMovimentacao(dado.data.tipo);
        setDataMovimentacao(dado.data.data_operacao);
        setSetorId(dado.data.setor_id);
      }
      const response = await axios.get('/setor');
      setSetores(response.data);

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
        const response = await axios.post('/caixaEbd', {
          descricao,
          valor,
          tipo: tipoMovimentacao,
          data_operacao: dataMovimentacao,
          setor_id: setorId,
        });
        console.log(response);
        setDescricao('');
        setSetorSeletected(0);
        setComboBoxCongregacao('');
        toast.success('Movimentação criada com sucesso');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/caixaEbd/${id}`, {
          descricao,
          valor,
          tipo: tipoMovimentacao,
          data_operacao: dataMovimentacao,
          setor_id: setorId,
        });
        console.log(response);
        setDescricao('');
        setSetorSeletected(0);
        setComboBoxCongregacao('Selecione uma congregação');
        toast.success('Movimentação editada com sucesso');

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

  return (
    <Container>
      <h1>Caixa EBD</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Descrição</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value.toLocaleUpperCase());
              }}
              placeholder="Descricao"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="valor">Valor</Form.Label>
            <Form.Control
              id="valor"
              type="number"
              value={valor}
              onChange={(e) => {
                setValor(e.target.value);
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>

          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="dataBatismo">Data da operação:</Form.Label>
            <Form.Control
              id="dataBatismo"
              type="date"
              value={dataMovimentacao}
              onChange={(e) => {
                setDataMovimentacao(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={{ span: 3, offset: 3 }} className="my-1">
            <Label htmlFor="congregacao">
              Tipo de movimentação
              <select
                onChange={handleTipoMovimentacao}
                value={tipoMovimentacaoBox}
              >
                <option value="nada">Entrada/Saída</option>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </Label>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <ComboBox
              title="Selecione a Congregação"
              list={setores}
              value={setor}
              onChange={handleGetIdCongregacao}
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
CaixaEbd.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
