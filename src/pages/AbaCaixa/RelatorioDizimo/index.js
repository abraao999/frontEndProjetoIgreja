/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useState } from 'react';

import { toast } from 'react-toastify';
import {
  FaEdit,
  FaWindowClose,
  FaSearch,
  FaCheck,
  FaCcJcb,
} from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import { Label, Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
import ModalMembro from '../../../components/ModalMembro';
import {
  formataDataInput,
  formataDataInputInverso,
  getDataBanco,
  getDataDB,
  listMeses,
} from '../../../util';

export default function RelatorioDizimo() {
  const [show, setShow] = useState(false);
  const [showMembro, setShowMembro] = useState(false);

  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [idMembro, setIdMembro] = useState('');
  const [nomeMembro, setNomeMembro] = useState('');

  const [membros, setMembros] = useState([]);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [ano, setAno] = useState('2021');

  const renderizaLista = (list) => {
    const novaLista = [];
    listMeses.map((mes) => {
      let mesEncontrado = false;

      list.map((membro) => {
        const data = new Date(membro.data_operacao);

        if (data.getMonth() === mes.id) {
          mesEncontrado = true;
        }
      });
      novaLista.push({
        id: mes.id,
        mesEncontrado,
        descricao: mes.descricao,
      });
    });
    setIsLoading(false);
    setListMovimentacao(novaLista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const list = [];
    if (idMembro) {
      axios.get(`/dizimo/pesquisaData/${idMembro}`).then((dado) => {
        dado.data.map((valor) => {
          let getAno = new Date(valor.data_operacao);
          getAno = `${getAno.getFullYear()}`;
          if (getAno === ano) {
            list.push(valor);
          }
        });
        renderizaLista(list);
      });
      setHidden(false);
    } else {
      toast.error('Selecione todos os campos para filtrar');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleCloseMembros = () => {
    setShowMembro(false);
  };
  const handleShow = (idFuncao, index) => {
    setIdParaDelecao(idFuncao);
    setIndiceDelecao(index);
    setShow(true);
  };
  const handleShowMembros = () => {
    setShowMembro(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/dizimo/${idParaDelecao}`);
      const novaList = [...listMovimentacao];
      novaList.splice(indiceDelecao, 1);
      setListMovimentacao(novaList);
      toast.success('Movimentação excluido com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir a membro');
      }
      setIsLoading(false);
    }
  };

  const handleIdMembro = async (idm) => {
    try {
      const response = await axios.get(`/membro/${idm}`);
      console.log(response.data);
      setNomeMembro(response.data.nome);
      setIdMembro(response.data.id);
      handleCloseMembros();
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
      handleShowMembros();
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  const handleAno = async (e) => {
    const valor = String(e.target.value);
    console.log(valor);
  };
  return (
    <Container>
      <h1>Relatório de dízimo</h1>
      <Loading isLoading={isLoading} />
      <ModalMembro
        title="Selecione o membro"
        handleClose={handleCloseMembros}
        show={showMembro}
        list={membros}
        buttonCancel="Fechar"
        handleIdMembro={handleIdMembro}
      />
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
        <Row>
          <Col sm={12} md={2} className="my-1">
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
          <Col sm={12} md={8} className="my-1">
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
          <Col sm={12} md={2} className="my-1">
            <Label htmlFor="departamento">
              Ano
              <select onChange={handleAno}>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
              </select>
            </Label>
          </Col>
        </Row>

        <Row>
          <button type="submit">
            Filtrar <FaSearch />
          </button>
        </Row>
      </Form>
      <Listagem hidden={hidden}>
        <h3>Relatório de dizimo</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Nome do mês</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {listMovimentacao.map((dado) => (
                <tr key={String(dado.id)}>
                  <td>{dado.descricao}</td>
                  <td>
                    {dado.mesEncontrado ? (
                      <FaCheck size={12} />
                    ) : (
                      <FaWindowClose size={12} color="red" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
    </Container>
  );
}
