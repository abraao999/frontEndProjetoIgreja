import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';

import { toast } from 'react-toastify';
import {
  FaEdit,
  FaFilter,
  FaHourglassHalf,
  FaPrint,
  FaRegEnvelope,
  FaSave,
  FaSearch,
  FaTrash,
} from 'react-icons/fa';
import { BsCheck, BsCheckAll } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Row, Form, Table, Button } from 'react-bootstrap';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Container } from '../../../styles/GlobalStyles';
import { Label, LabelSelect, Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import ComboBox from '../../../components/ComboBox';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
// import * as actions from '../../store/modules/auth/actions';

import { Impressao } from '../../../printers/impLivrariaPedido';
import ModalMembro from '../../../components/ModalMembro';
import { meioPagamento } from '../../../util';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function ListaPedidoLivraria({ match }) {
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [nomeMembro, setNomeMembro] = useState('');
  const [idMembro, setIdMembro] = useState('');
  const [contato, setContato] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [status, setStatus] = useState('');
  const [tipoPagamento, setTipoPagamento] = useState('');
  const [descricaoList, setDescricaoList] = useState([]);
  const [listPedidos, setListPedidos] = useState([]);
  const [membros, setMembros] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const dataStorage = useSelector((state) => state.auth);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/livrariaPedido');
      setListPedidos(response.data);
      setIsLoading(false);
    }
    getData();
  }, [id]);
  const limpaCampos = () => {
    setNomeMembro('');
    setIdMembro('');
    setContato('');
    setDescricao('');
    setQuantidade('');
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idFuncao, index) => {
    setIdParaDelecao(idFuncao);
    setIndiceDelecao(index);
    setShowDelete(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/livrariaPedido/${idParaDelecao}`);
      const novaLista = [...listPedidos];
      novaLista.splice(indiceDelecao, 1);
      setListPedidos(novaLista);
      toast.success('Pedido excluído com sucesso');
      setShowDelete(false);

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
  const visualizarImpressao = async () => {
    const classeImpressao = new Impressao(listPedidos);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
  };
  const handlePesquisaNome = async () => {
    if (nomeMembro.length > 0) {
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
        setMembros(novaLista);
        setShow(true);
      } catch (e) {
        toast.error('Condigo não existe');
        console.log(e);
      }
    } else {
      axios.get('/membro').then((response) => {
        setMembros(response.data);
        setShow(true);
      });
    }
  };
  const handleIdMembro = async (idm) => {
    try {
      const response = await axios.get(`/membro/${idm}`);
      setNomeMembro(response.data.nome);
      handleClose();
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  const handleAlteraStatus = async (dado, index) => {
    setIsLoading(true);
    const novaLista = [...listPedidos];
    if (dado.status === 'PENDENTE') {
      await axios.put(`/livrariaPedido/${dado.id}`, {
        status: 'SOLICITADO',
      });
      novaLista[index] = { ...dado, status: 'SOLICITADO' };
      setListPedidos(novaLista);
    } else if (dado.status === 'SOLICITADO') {
      await axios.put(`/livrariaPedido/${dado.id}`, {
        status: 'ENTREGUE',
      });
      novaLista[index] = { ...dado, status: 'ENTREGUE' };
      setListPedidos(novaLista);
    } else if (dado.status === 'ENTREGUE') {
      await axios.put(`/livrariaPedido/${dado.id}`, {
        status: 'ENTREGUE E PAGO',
      });
      novaLista[index] = { ...dado, status: 'ENTREGUE E PAGO' };
      setListPedidos(novaLista);
    }

    setIsLoading(false);
  };
  const handleFiltro = () => {
    let novaLista = [];
    console.log(status, nomeMembro, tipoPagamento);
    if (status !== '') {
      novaLista = listPedidos.filter((dado) => {
        if (dado.status === status) return dado;
      });
    }
    if (tipoPagamento !== '') {
      novaLista = listPedidos.filter((dado) => {
        if (dado.tipo_pagamento === tipoPagamento) return dado;
      });
    }
    if (nomeMembro !== '') {
      novaLista = listPedidos.filter((dado) => {
        if (dado.nome === nomeMembro) return dado;
      });
    }
    setListPedidos(novaLista);
  };
  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Modal
        title="Atenção!!!"
        handleClose={() => setShowDelete(false)}
        show={showDelete}
        text="Deseja exluir esse registro"
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleFunctionConfirm}
      />
      <ModalMembro
        title="Selecione o membro"
        handleClose={handleClose}
        show={show}
        list={membros}
        buttonCancel="Fechar"
        handleIdMembro={handleIdMembro}
      />
      <Form>
        <Listagem>
          <h3>Lista de Pedidos</h3>
          <Button variant="success" onClick={visualizarImpressao} size="lg">
            <FaPrint size={30} />
          </Button>
        </Listagem>
        <Row>
          <Col sm={12} md={11} className="my-1">
            <Form.Label htmlFor="descricao">Nome do Membro</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={nomeMembro}
              onChange={(e) => {
                setNomeMembro(e.target.value);
              }}
              onBlur={(e) => {
                handlePesquisaNome();
              }}
              placeholder="Nome"
            />
          </Col>
          <Col
            sm={12}
            md={1}
            className="my-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Button size="lg" onClick={handlePesquisaNome} variant="success">
              <FaSearch size={16} />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4}>
            <LabelSelect htmlFor="cargo">
              Pagamento
              <select onChange={(e) => setTipoPagamento(e.target.value)}>
                <option value="nada">Selecione o tipo de pagamento</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Pendente">Pendente</option>
                <option value="Pix">PIX</option>
              </select>
            </LabelSelect>
          </Col>
          <Col sm={12} md={4}>
            <LabelSelect htmlFor="cargo">
              Status
              <select onChange={(e) => setStatus(e.target.value)}>
                <option value="nada">Selecione o status</option>
                <option value="ENTREGUE">Entregue</option>
                <option value="ENTREGUE E PAGO">Entregue e Pago</option>
                <option value="PENDENTE">Pendente</option>
                <option value="SOLICITADO">Solicitado</option>
              </select>
            </LabelSelect>
          </Col>
          <Col
            sm={12}
            md={4}
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Button variant="success" size="lg" onClick={handleFiltro}>
              <FaFilter size={16} />
            </Button>
          </Col>
        </Row>
      </Form>

      <h3>Lista de Pedidos</h3>

      <Table responsive striped bordered hover style={{ textAlign: 'center' }}>
        <thead>
          <tr>
            <th scope="col">Descição</th>
            <th scope="col">Quantidade</th>
            <th scope="col">Nome</th>
            <th scope="col">Contato</th>
            <th scope="col">Pagamento</th>
            <th scope="col">Status</th>
            <th scope="col">Alterar</th>
            <th scope="col">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {listPedidos.map((dado, index) => (
            <tr key={String(dado.id)}>
              <td>{dado.descricao}</td>
              <td>{dado.quantidade}</td>
              <td>{dado.nome}</td>
              <td>{dado.contato}</td>
              <td>{dado.tipo_pagamento}</td>
              <td>
                {dado.status === 'PENDENTE' ? (
                  <Button
                    variant="dark"
                    onClick={() => handleAlteraStatus(dado, index)}
                  >
                    <FaHourglassHalf size={16} color="danger" />
                  </Button>
                ) : dado.status === 'ENTREGUE' ? (
                  <Button
                    variant="success"
                    onClick={() => handleAlteraStatus(dado, index)}
                  >
                    <BsCheck size={16} />
                  </Button>
                ) : dado.status === 'ENTREGUE E PAGO' ? (
                  <Button
                    variant="success"
                    onClick={() => handleAlteraStatus(dado, index)}
                    disabled
                  >
                    <BsCheckAll size={16} />
                  </Button>
                ) : (
                  <Button
                    variant="info"
                    onClick={() => handleAlteraStatus(dado, index)}
                  >
                    <FaRegEnvelope size={16} />
                  </Button>
                )}
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => history.push(`/pedidoLivro/${dado.id}/edit`)}
                >
                  <FaEdit size={16} />
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleShow(dado.id, index)}
                >
                  <FaTrash size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
ListaPedidoLivraria.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
