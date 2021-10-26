/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaSearch } from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import { Listagem } from './styled';
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
} from '../../../util';

export default function RelatorioDizimo() {
  const [show, setShow] = useState(false);
  const [showMembro, setShowMembro] = useState(false);

  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [idMembro, setIdMembro] = useState('');
  const [nomeMembro, setNomeMembro] = useState('');

  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  const [membros, setMembros] = useState([]);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const renderizaLista = (list) => {
    const novaLista = [];
    list.map((dado) => {
      const data = new Date(dado.data_operacao);
      const dataFormatada = `${data.getDate() + 1}/${
        data.getMonth() + 1
      }/${data.getFullYear()}`;
      novaLista.push({
        id: dado.id,
        nomeMembro: nomeMembro || dado.nome,
        dataOp: dataFormatada,
        valor: dado.valor,
      });
    });
    setIsLoading(false);
    setListMovimentacao(novaLista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const list = [];
    const di = formataDataInput(dataInicial);
    const df = formataDataInput(dataFinal);
    if (idMembro && dataInicial && dataFinal) {
      axios.get(`/dizimo/pesquisaData/${idMembro}`).then((dado) => {
        dado.data.map((valor) => {
          if (
            getDataDB(new Date(valor.data_operacao)) >= di &&
            getDataDB(new Date(valor.data_operacao)) <= df
          ) {
            list.push(valor);
          }
        });
        renderizaLista(list);
      });
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
          <Col sm={12} md={4} className="my-1">
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
            <Form.Label htmlFor="dataInicial">Data Inicial</Form.Label>
            <Form.Control
              type="date"
              value={dataInicial}
              onChange={(e) => {
                setDataInicial(e.target.value);
              }}
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataInicial">Data Final</Form.Label>
            <Form.Control
              type="date"
              value={dataFinal}
              onChange={(e) => {
                setDataFinal(e.target.value);
              }}
            />
          </Col>
        </Row>

        <Row>
          <button type="submit">
            Filtrar <FaSearch />
          </button>
        </Row>
      </Form>
      <Listagem>
        <h3>Relatório de dizimo</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">R.F</th>
                <th scope="col">Data</th>
                <th scope="col">Nome do Membro</th>
                <th scope="col">Valor</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {listMovimentacao.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.id}</td>
                  <td>{dado.dataOp}</td>
                  <td>{dado.nomeMembro}</td>
                  <td>{dado.valor}</td>

                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(`/dizimo/${dado.id}/edit`);
                      }}
                      to={`/dizimo/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/relatorioDizimo"
                    >
                      <FaWindowClose size={16} />
                    </Link>
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
