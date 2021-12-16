import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';

import { toast } from 'react-toastify';
import { FaEdit, FaPlus, FaWindowClose } from 'react-icons/fa';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import Modal from '../../../components/Modal';

import { Listagem, Label, LabelInput } from './styled';
import axios from '../../../services/axios';

import Loading from '../../../components/Loading';
import history from '../../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function NovoVisitante({ match }) {
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');
  const [telefone, setTelefone] = useState('');

  const [maxId, setMaxId] = useState(0);
  const [nome, setNome] = useState('');
  const [nomeIgreja, setIngrejaNome] = useState('');
  const [observacao, setObservacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [descricaoList, setDescricaoList] = useState([]);
  const [nomesList, setNomesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [crente, setCrente] = useState(true);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      // const response = await axios.get('/visitantes/maxId');
      // setMaxId(response.data);
      // setDescricaoList(response.data);

      setIsLoading(false);
    }
    getData();
  }, [id]);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (index) => {
    const novosNomes = [...nomesList];
    novosNomes.splice(index, 1);
    setNomesList(novosNomes);
  };
  const handleFunctionConfirm = async (e) => {
    e.preventDefault();
    // setShow(true);
    try {
      setIsLoading(true);
      const response = await axios.post(`/familiaVisitante/`, {
        telefone,
        igreja: nomeIgreja,
        crente,
        observacao,
        data_culto: new Date(),
      });
      const idResposta = response.data.id;
      nomesList.map(async (item) => {
        await axios.post('/nomesVisitante', {
          familia_id: idResposta,
          nome: item.nome,
        });
      });
      toast.success('Visitante adcionado com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao adicionar o visitantes');
      }
      setIsLoading(false);
    }
  };
  const handleCrente = (e) => {
    if (String(e.target.value) === 'Sim') setCrente(true);
    else setCrente(false);
  };
  const addNome = () => {
    nomesList.push({ id: Math.random(), nome });
    setNome('');
    setHidden(false);

    const input = document.getElementById('nome');
    input.focus();
  };

  return (
    <Container>
      <h1>Novo Visitante</h1>
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
      <Form onSubmit={handleFunctionConfirm}>
        <Row>
          <Col sm={10} xs={10} md={5} className="my-1">
            <Form.Label htmlFor="descricao">Nome:</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              id="nome"
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do Visitante"
            />
          </Col>
          <Col
            sm={2}
            xs={2}
            md={1}
            className="my-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <button type="button" onClick={addNome}>
              <FaPlus size={12} />
            </button>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Label htmlFor="congregacao">
              Crente
              <select onChange={handleCrente}>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </Label>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Observação:</Form.Label>
            <Form.Control
              type="text"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Amigo de ..."
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <LabelInput htmlFor="telefone">
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
            </LabelInput>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Igreja onde congrega:</Form.Label>
            <Form.Control
              type="text"
              value={nomeIgreja}
              onChange={(e) => setIngrejaNome(e.target.value)}
              placeholder="Nome da igreja"
            />
          </Col>
        </Row>
      </Form>
      <Listagem hidden={hidden}>
        <h3>Nomes</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope="col">
                  Nome
                </th>
                <th style={{ textAlign: 'center' }} scope="col">
                  Remover
                </th>
              </tr>
            </thead>
            <tbody>
              {nomesList.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td style={{ textAlign: 'center' }}>{dado.nome}</td>

                  <td style={{ textAlign: 'center' }}>
                    <Link to="/novoVisitante" onClick={() => handleShow(index)}>
                      <FaWindowClose size={30} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
      <Row style={{ margin: 5 }}>
        <button type="button" onClick={handleFunctionConfirm}>
          Salvar
        </button>
      </Row>
      <Row style={{ margin: 5 }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            history.push('/visitante');
          }}
          type="button"
        >
          Voltar
        </button>
      </Row>
    </Container>
  );
}
NovoVisitante.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
