/* eslint-disable import/order */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaRegListAlt, FaSearch } from 'react-icons/fa';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Container } from '../../../styles/GlobalStyles';
import { Header, Label, Listagem } from './styled';
import { AiFillPrinter } from 'react-icons/ai';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
import { Row, Table, Form, Col } from 'react-bootstrap';
// import * as actions from '../../store/modules/auth/actions';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Impressao } from '../../../printers/impMembros';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function ListMembros({ match }) {
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');
  const [filtro, setFiltro] = useState(false);
  const [setores, setSetores] = useState([]);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const [congregacaoId, setCongregacaoId] = useState(
    'Selecione uma congregação'
  );

  const [membros, setMembros] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [NCadastro, setNCadastro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/setor');
      setSetores(response.data);
      const response2 = await axios.get('/membro');
      setMembros(response2.data);
      setIsLoading(false);
    }
    getData();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];
    if (descricao.length > 1) {
      const response = await axios.get('/membro');
      response.data.map((dados) => {
        if (
          String(dados.nome)
            .toLowerCase()
            .includes(String(descricao.toLowerCase()))
        ) {
          novaLista.push(dados);
        }
      });
      setDescricao('');
    } else if (NCadastro.length >= 1) {
      const response = await axios.get(`/membro/${NCadastro}`);
      novaLista.push(response.data);
      setNCadastro('');
    } else {
      console.log();
      if (!filtro) {
        membros.map((dados) => {
          if (dados.setor_id === setorSeletected) {
            novaLista.push(dados);
          }
        });
        setFiltro(true);
      } else {
        const response = await axios.get('/membro');
        response.data.map((dados) => {
          if (dados.setor_id === setorSeletected) {
            novaLista.push(dados);
          }
        });
      }
    }
    setMembros(novaLista);
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
      await axios.delete(`/membro/${idParaDelecao}`);
      const novaList = [...membros];
      novaList.splice(indiceDelecao, 1);
      setMembros(novaList);
      toast.success('Membro excluido com sucesso');
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
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);

    setores.map((dado) => {
      if (nome === dado.descricao) setSetorSeletected(dado.id);
    });
  };
  const visualizarImpressao = async () => {
    const novaLista = [];
    membros.map((dado) => {
      const data = new Date(dado.data_nascimento);
      const dataFormatada = `${data.getDate()}/${
        data.getMonth() + 1
      }/${data.getFullYear()}`;
      novaLista.push({
        nome: dado.nome,
        telefone: dado.telefone,
        desc_setor: dado.desc_setor,
        desc_cargo: dado.desc_cargo,
        aniversario: dataFormatada,
      });
    });
    const classeImpressao = new Impressao(novaLista);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
  };
  return (
    <Container>
      <Header>
        <h2>Lista de Membros</h2>
        <button type="button" onClick={visualizarImpressao}>
          <AiFillPrinter size={35} />
        </button>
      </Header>
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
          <Col sm={12} md={2} className="my-1">
            <Form.Label htmlFor="descricao">Nº do cadastro:</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={NCadastro}
              onChange={(e) => {
                setNCadastro(e.target.value);
              }}
              placeholder="Número do cadastro"
            />
          </Col>
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
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="congregacao">
              Filtrar por congregação
              <select onChange={handleGetIdCongregacao} value={congregacaoId}>
                <option value="nada">Selecione a congregação</option>
                {setores.map((dado) => (
                  <option key={dado.id} value={dado.descricao}>
                    {dado.descricao}
                  </option>
                ))}
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
      <Listagem>
        <h3>Lista de Membros</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Nº Ficha</th>
                <th scope="col">Nome</th>
                <th scope="col">Telefone</th>
                <th scope="col">Congregação</th>
                <th scope="col">Cargo</th>
                <th scope="col">Detalhes</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {membros.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.id}</td>
                  <td>{dado.nome}</td>
                  <td>{dado.telefone}</td>
                  <td>{dado.desc_setor}</td>
                  <td>{dado.desc_cargo}</td>
                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.dep_descricao);
                        history.push(`/detailMembro/${dado.id}`);
                      }}
                      to={`/detailMembro/${dado.id}`}
                    >
                      <FaRegListAlt size={16} />
                    </Link>
                  </td>

                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.dep_descricao);
                        history.push(`/cadMembro/${dado.id}/edit`);
                      }}
                      to={`/cadMembro/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/listMembros"
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
ListMembros.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
