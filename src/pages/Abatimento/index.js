/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { get } from 'lodash';
import { Row, Form, Col } from 'react-bootstrap';
import { Container } from '../../styles/GlobalStyles';
import axios from '../../services/axios';
import ComboBox from '../../components/ComboBox';
import Loading from '../../components/Loading';
// import * as actions from '../../store/modules/auth/actions';

export default function Abatimento({ match }) {
  const id = get(match, 'params.id', '');

  const [maxId, setMaxId] = useState(0);

  const [setorId, setSetorId] = useState('');
  const [setor, setSetor] = useState('');
  const [setores, setSetores] = useState([]);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const [comboBoxCongregacao, setComboBoxCongregacao] = useState(
    'Selecione uma congregação'
  );
  const [valor, setValor] = useState('');
  const [dataMovimentacao, setDataMovimentacao] = useState('');

  const [departamentos, setDepartamentos] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      if (!id) {
        try {
          const dado = await axios.get('/abatimento/maxId');
          setMaxId(dado.data + 1);
        } catch (error) {
          setMaxId(1);
        }
      }
      const response = await axios.get('/setor');
      setSetores(response.data);
      const response2 = await axios.get('/departamento');
      setDepartamentos(response2.data);
      console.log(setorSeletected);
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
        const response = await axios.post('/abatimento', {
          descricao,
          valor,
          data_operacao: dataMovimentacao,
          setor_id: setorId,
        });
        console.log(response);
        setDescricao('');
        setSetorSeletected(0);
        setComboBoxCongregacao('');
        toast.success('Abimento criado com sucesso');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/abatimento/${id}`, {
          descricao,
          valor,
          data_operacao: dataMovimentacao,
          setor_id: setorSeletected,
        });
        console.log(response);
        setDescricao('');
        setSetorSeletected(0);
        setComboBoxCongregacao('Selecione uma congregação');
        toast.success('Abatimento editada com sucesso');

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

  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setSetor(e.target.value);
    setores.map((dado) => {
      if (nome === dado.descricao) setSetorId(dado.id);
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
      <h1>Abatimento</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="id">F.E.:</Form.Label>
            {id ? (
              <Form.Control id="id" type="text" value={id} disabled />
            ) : (
              <Form.Control id="maxId" type="text" value={maxId} disabled />
            )}
          </Col>

          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Descrição</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
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
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col sm={12} md={6} className="my-1">
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
          <Col sm={12} md={6} className="my-1">
            <ComboBox
              title="Selecione a Congregação"
              list={setores}
              value={setor}
              onChange={handleGetIdCongregacao}
            />
          </Col>
        </Row>
        <Row className="align-items-center">
          <button type="submit">Salvar</button>
        </Row>
      </Form>
    </Container>
  );
}
Abatimento.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
