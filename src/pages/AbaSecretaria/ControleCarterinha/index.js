/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import {
  FaEdit,
  FaWindowClose,
  FaSearch,
  FaCheck,
  FaSave,
} from 'react-icons/fa';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table, Button } from 'react-bootstrap';

import { useSelector } from 'react-redux';
import { Container } from '../../../styles/GlobalStyles';
import { Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';

import Loading from '../../../components/Loading';
import history from '../../../services/history';
import ModalMembro from '../../../components/ModalMembro';
// import * as actions from '../../store/modules/auth/actions';

export default function ControleCarterinha() {
  const dataStorage = useSelector((state) => state.auth.user);
  const [show, setShow] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [showSalvar, setShowSalvar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nomeMembro, setNomeMembro] = useState('');
  const [idMembro, setIdMembro] = useState('');
  const [membros, setMembros] = useState([]);
  const [listFuncoes, setListFuncoes] = useState([]);
  const [listMembros, setListMembros] = useState([]);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      axios.get('/membro').then((dados) => {
        //  setListMembros(response.data);
        handleRenderizaLista(dados.data);
      });

      setIsLoading(false);
    }
    getData();
  }, []);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/controleCarterinha`);
      listMembros.map(async (dado) => {
        let existe = false;
        const idm = 0;
        response.data.map(async (resposta) => {
          if (dado.checked && resposta.membro_id !== dado.id) {
            existe = true;
          } else console.log(dado);
        });
        // if (!existe)
        //   await axios.post('/controleCarterinha', {
        //     membro_id: idm,
        //     status: true,
        //   });
      });
      setShowSalvar(false);
      toast.success('Alterações realizadas com sucesso');
      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir a classe');
      }
      setIsLoading(false);
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
      setMembros(novaLista);
      handleShow();
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  const handleCheck = (dado) => {
    const novaLista = [];
    listMembros.map((item) => {
      if (item.id === dado) novaLista.push({ ...item, checked: !item.checked });
      else novaLista.push(item);
    });
    console.log(novaLista);
    setListMembros(novaLista);
  };
  const handleRenderizaLista = async (list) => {
    const novaLista = [];
    const response = await axios.get('/controleCarterinha');
    list.map((membro) => {
      let pula = true;
      response.data.map((dado) => {
        // if (response.data.length === 0)
        //   novaLista.push({ ...membro, checked: false });
        // else
        if (membro.id === dado.membro_id) {
          novaLista.push({ ...membro, checked: true });
          pula = false;
        }
      });
      pula && novaLista.push({ ...membro, checked: false });
    });
    console.log(novaLista);
    setListMembros(novaLista);
  };
  const handleIdMembro = async (idm) => {
    try {
      setHidden(false);

      const response = await axios.get(`/membro/${idm}`);
      setNomeMembro(response.data.nome);
      setIdMembro(response.data.id);
      const response2 = await axios.get(
        `/controleCarterinha/getEntregues/${idm}`
      );
      response2.data.length > 0
        ? setListMembros([{ ...response.data, checked: true }])
        : setListMembros([{ ...response.data, checked: false }]);
      handleClose();
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };

  return (
    <Container>
      <h1> Controle de Acesso</h1>
      <Loading isLoading={isLoading} />
      <ModalMembro
        title="Selecione o membro"
        handleClose={handleClose}
        show={show}
        list={membros}
        buttonCancel="Fechar"
        handleIdMembro={handleIdMembro}
      />
      <Modal
        title="Atenção!!!"
        handleClose={() => setShowSalvar(false)}
        show={showSalvar}
        text="Deseja salvar as alterações"
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleFunctionConfirm}
      />
      <Form onSubmit={handlePesquisaNome}>
        <Row>
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
                if (e.target.value.length > 0) handlePesquisaNome();
              }}
              placeholder="Nome"
            />
          </Col>
          <Col
            sm={12}
            md={4}
            className="my-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <button type="submit">
              Buscar <FaSearch />
            </button>
          </Col>
        </Row>
      </Form>
      <Listagem>
        <h3>Lista de Funções</h3>
        <center>
          <Table
            className="table table-striped"
            style={{ textAlign: 'center' }}
          >
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Congregação</th>
                <th scope="col">Permissão</th>
              </tr>
            </thead>
            <tbody>
              {listMembros.map((dado) => (
                <tr key={String(dado.id)}>
                  <td>{dado.nome}</td>
                  <td>{dado.desc_setor}</td>

                  <td>
                    {dado.checked ? (
                      <Button
                        onClick={() => {
                          handleCheck(dado.id);
                        }}
                        variant="success"
                      >
                        <FaCheck />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          handleCheck(dado.id);
                        }}
                        variant="danger"
                      >
                        <FaWindowClose />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <button type="button" onClick={() => setShowSalvar(true)}>
            Salvar <FaSave />
          </button>
        </center>
      </Listagem>
    </Container>
  );
}
