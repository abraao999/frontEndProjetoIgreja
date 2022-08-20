/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { get } from 'lodash';
import { Container } from '../../../styles/GlobalStyles';
import Loading from '../../../components/Loading';
import axios from '../../../services/axios';
import ModalMembro from '../../../components/ModalMembro';
import history from '../../../services/history';
import {
  FaEdit,
  FaSearch,
  FaTasks,
  FaTrash,
  FaWindowClose,
} from 'react-icons/fa';
import { Listagem } from './styled';
import { Link } from 'react-router-dom';
import ComboBox from '../../../components/ComboBox';
import { meioPagamento } from '../../../util';

export default function Venda({ match }) {
  const id = get(match, 'params.id', '');

  const [nomeMembro, setNomeMembro] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idLivro, setIdLivro] = useState('');
  const [idMembro, setIdMembro] = useState('');
  const [tipoPagamento, setTipoPagamento] = useState('');
  const [valorCompra, setValorCompra] = useState(0);
  const [show, setShow] = useState(false);
  const [showMembro, setShowMembro] = useState(false);
  const [listaCompra, setListaCompra] = useState([]);
  const [listLivro, setListLivro] = useState([]);
  const [membros, setMembros] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/membro');
      setMembros(response.data);
      const response2 = await axios.get('/livrariaLivro');
      setListLivro(response2.data);
      setIsLoading(false);
    }
    getData();
  }, [id]);

  const limpaCampos = () => {
    setNomeMembro('');
    setIdMembro('');
    setListaCompra([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let novaLista = [];
    if (descricao.length > 0) {
      try {
        const novaLista = [];
        const response = await axios.get('/livrariaLivro');
        response.data.map((dados) => {
          if (
            String(dados.descricao)
              .toLowerCase()
              .includes(String(descricao.toLowerCase()))
          ) {
            novaLista.push(dados);
          }
        });
        setListLivro(novaLista);
        handleShow();
      } catch (e) {
        toast.error('Condigo não existe');
        console.log(e);
      }
    } else {
      novaLista = [...listLivro];
      const aux = novaLista.filter((valor) => {
        return valor.quantidade > 0 && valor;
      });
      handleShow();
      setListLivro(aux);
    }
  };
  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleIdLivro = async (idm) => {
    const novaLista = [...listaCompra];
    setIsLoading(true);
    const aux = [];
    try {
      const response = await axios.get(`/livrariaLivro/${idm}`);
      setDescricao(response.data.descricao);
      setIdLivro(response.data.id);
      setValorCompra(valorCompra + parseFloat(response.data.valor));
      novaLista.push(response.data);

      listLivro.map((dado) => {
        if (dado.id === idm) {
          aux.push({ ...dado, quantidade: parseInt(dado.quantidade) - 1 });
        } else {
          aux.push(dado);
        }
      });
      console.log(aux);
      setListLivro(aux);
      handleClose();
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
    setListaCompra(novaLista);
    setDescricao('');
    setIsLoading(false);
  };
  const handleIdMembro = async (idm) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/membro/${idm}`);
      console.log(response.data);
      setNomeMembro(response.data.nome);
      setIdMembro(response.data.id);
      setShowMembro(false);
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
    setIsLoading(false);
  };
  const handlePesquisaNome = async () => {
    try {
      const novaLista = [];
      const response = await axios.get('/livrariaLivro');
      response.data.map((dados) => {
        if (
          String(dados.descricao)
            .toLowerCase()
            .includes(String(descricao.toLowerCase()))
        ) {
          novaLista.push(dados);
        }
      });
      setListLivro(novaLista);
      handleShow();
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  const handlePesquisaMembro = async () => {
    try {
      if (nomeMembro.length > 0) {
        const novaLista = [];
        membros.map((dados) => {
          if (
            String(dados.descricao)
              .toLowerCase()
              .includes(String(descricao.toLowerCase()))
          ) {
            novaLista.push(dados);
          }
        });
        setMembros(novaLista);
      }
      setShowMembro(true);
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  const handleFinalizar = async () => {
    setIsLoading(true);
    try {
      if (
        nomeMembro === '' ||
        listaCompra.length === 0 ||
        tipoPagamento === ''
      ) {
        toast.error('Complete todos os campos');
        setIsLoading(false);
        return;
      }
      axios
        .post('/livrariaVenda', {
          data_venda: new Date(),
          membro_id: idMembro,
          valor: valorCompra,
          nome_cliente: nomeMembro,
          tipo_pagamento: tipoPagamento,
        })
        .then((response) => {
          listaCompra.map(async (dado) => {
            await axios.post('/livrariaVendaIten', {
              venda_id: response.data.id,
              livro_id: dado.id,
            });
            const aux = await axios.get(`/livrariaLivro/${dado.id}`);
            const qtde = parseInt(aux.data.quantidade) - 1;
            console.log(aux, qtde);
            await axios.put(`/livrariaLivro/${dado.id}`, {
              quantidade: qtde,
            });
          });
        });
      limpaCampos();
      toast.success('Venda realizada com sucesso');
      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      const msg = get(error, 'response.data.erros', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer login');
      } else {
        msg.map((dado) => toast.error(dado));
      }
      setIsLoading(false);
    }
  };
  const handleRemoveItem = (dado, index) => {
    const novaLista = [...listaCompra];
    novaLista.splice(index, 1);
    setListaCompra(novaLista);
    const aux = valorCompra - parseFloat(dado.valor);
    setValorCompra(aux);
  };
  return (
    <Container>
      <ModalMembro
        title="Selecione o livro"
        handleClose={handleClose}
        show={show}
        list={listLivro}
        buttonCancel="Fechar"
        handleIdMembro={handleIdLivro}
      />
      <ModalMembro
        title="Selecione o membro"
        handleClose={() => setShowMembro(false)}
        show={showMembro}
        list={membros}
        buttonCancel="Fechar"
        handleIdMembro={handleIdMembro}
      />
      <h2>Painel de Venda</h2>
      <Loading isLoading={isLoading} />
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="descricao">Nome do Cliente</Form.Label>

            <Form.Control
              id="input"
              type="text"
              value={nomeMembro}
              onChange={(e) => {
                setNomeMembro(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value.length > 0) handlePesquisaMembro();
              }}
              placeholder="Nome"
            />
          </Col>
          <Col
            sm={12}
            md={2}
            className="my-1"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
            }}
          >
            <Button variant="success" onClick={handlePesquisaMembro}>
              <FaSearch size={24} />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="descricao">Nome do Livro</Form.Label>

            <Form.Control
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value.length > 0) handlePesquisaNome();
              }}
              placeholder="Nome"
            />
          </Col>
          <Col
            sm={12}
            md={2}
            className="my-1"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
            }}
          >
            <Button variant="success" type="submit">
              <FaSearch size={24} />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <ComboBox
              title={'Selecione o meio de pagamento'}
              list={meioPagamento}
              onChange={(e) => setTipoPagamento(e.target.value)}
              value={tipoPagamento}
            />
          </Col>
        </Row>
      </Form>
      <Listagem>
        <h3>Carrinho de compra</h3>
        <center>
          <Table
            responsive
            striped
            bordered
            hover
            style={{ textAlign: 'center' }}
          >
            <thead>
              <tr>
                <th scope="col">Descição</th>
                <th scope="col">Valor</th>
                <th scope="col">Remover</th>
              </tr>
            </thead>
            <tbody>
              {listaCompra.map((dado, index) => (
                <tr key={String(index)}>
                  <td>{dado.descricao}</td>
                  <td>R$ {dado.valor}</td>

                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveItem(dado, index)}
                    >
                      <FaTrash size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
        <p>
          <strong> Valor Total: R$ {valorCompra}</strong>
        </p>
        <Button variant="success" onClick={handleFinalizar}>
          Finalizar compra
        </Button>
      </Listagem>
    </Container>
  );
}
Venda.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
