/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaRegListAlt, FaSearch } from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Row, Form, Table, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Container } from '../../../styles/GlobalStyles';
import { Listagem, Label } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
import * as colors from '../../../config/colors';

export default function ListAlunosTeologia({ match }) {
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');
  const [filtro, setFiltro] = useState(false);
  const [classes, setClasses] = useState([]);
  const [setors, setSetors] = useState([]);
  const [classeSeletected, setClasseSeletected] = useState(0);
  const [congregacaoId, setCongregacaoId] = useState(
    'Selecione uma congregação'
  );

  const [aluno, setAluno] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dataStorage = useSelector((state) => state.auth);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      axios.get('/teologiaClasse').then((res) => {
        setClasses(res.data);
      });
      axios.get('/teologiaAluno').then((res) => {
        setAluno(res.data);
      });
      setIsLoading(false);
    }
    getData();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];
    if (descricao.length > 1) {
      aluno.map((dados) => {
        if (String(dados.nome).toLowerCase().includes(String(descricao))) {
          novaLista.push(dados);
        }
      });
    } else {
      console.log(aluno);
      if (!filtro) {
        aluno.map((dados) => {
          if (dados.classe_id === classeSeletected) {
            novaLista.push(dados);
          }
        });
        setFiltro(true);
      } else {
        const response = await axios.get('/teologiaAluno');
        response.data.map((dados) => {
          if (dados.classe_id === classeSeletected) {
            novaLista.push(dados);
          }
        });
      }
    }
    setAluno(novaLista);
    setIsLoading(false);
  }

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idFuncao, index) => {
    setIdParaDelecao(idFuncao);
    setIndiceDelecao(index);
    setShow(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/teologiaAluno/${idParaDelecao}`);
      const novaList = [...aluno];
      novaList.splice(indiceDelecao, 1);
      setAluno(novaList);
      toast.success('Aluno excluido com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir um aluno');
      }
      setIsLoading(false);
    }
  };
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);

    classes.map((dado) => {
      if (nome === dado.descricao) setClasseSeletected(dado.id);
    });
  };
  return (
    <Container>
      <h1>Lista de Alunos</h1>
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
        <Row>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="descricao">
              Insira um nome para filtrar:
            </Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
              }}
              placeholder="Nome para filtro"
            />
          </Col>
          <Col sm={12} md={6} className="my-1">
            <Label htmlFor="congregacao">
              Filtrar por classe
              <select onChange={handleGetIdCongregacao} value={congregacaoId}>
                <option value="nada">Selecione a classe</option>
                {classes.map((dado) => (
                  <option key={dado.id} value={dado.descricao}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
        </Row>
        <Row>
          <Button
            style={{
              background: `${colors.primaryColor}`,
              borderColor: `${colors.primaryColor}`,
            }}
            type="submit"
          >
            Filtrar <FaSearch />
          </Button>
        </Row>
      </Form>
      <Listagem>
        <h3>Lista de Membros</h3>
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
                <th scope="col">Nome</th>
                <th scope="col">Telefone</th>
                <th scope="col">Classe</th>
                <th scope="col">Detalhes</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {aluno.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.nome}</td>
                  <td>{dado.telefone}</td>
                  <td>{dado.desc_classe}</td>
                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(`/detailAlunoTeologia/${dado.id}`);
                      }}
                      to={`/detailAlunoTeologia/${dado.id}`}
                    >
                      <FaRegListAlt size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.dep_descricao);
                        history.push(`/cadAlunoTeologia/${dado.id}/edit`);
                      }}
                      to={`/cadAlunoTeologia/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/listAlunosTeologia"
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
ListAlunosTeologia.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
