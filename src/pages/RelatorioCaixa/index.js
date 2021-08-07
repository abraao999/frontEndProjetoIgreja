/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaSearch } from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../styles/GlobalStyles';
import { Label, Listagem } from './styled';
import axios from '../../services/axios';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import history from '../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function RelatorioCaixa() {
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [investimentoBox, setInvestimentoBox] = useState('');
  const [tipoBox, setTipoBox] = useState('');
  const [investimento, setInvestimento] = useState('');
  const [msg, setMsg] = useState(true);
  const [filtro, setFiltro] = useState(false);
  const [filtroDep, setFiltroDep] = useState(false);
  const [filtroInvestimento, setFiltroInvestimento] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState(false);

  const [valorTotal, setValorTotal] = useState(0);
  const [setores, setSetores] = useState([]);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const [departamentoSeletected, setDepatamentoSeletected] = useState(0);
  const [congregacaoId, setCongregacaoId] = useState(
    'Selecione uma congregação'
  );
  const [departamentoId, setDepartamentoId] = useState(
    'Selecione um departamento'
  );

  const [departamentos, setDepartamentos] = useState([]);
  const [membros, setMembros] = useState([]);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/setor');
      setSetores(response.data);
      const response2 = await axios.get('/departamento');
      setDepartamentos(response2.data);

      axios.get('/caixa').then(async (dado) => {
        setListMovimentacao(dado.data);
        renderizaLista(dado.data);
      });
      setIsLoading(false);
    }
    getData();
  }, []);

  const renderizaLista = (list) => {
    let novoValor = 0;
    const novaLista = [];
    list.map((dado) => {
      const data = new Date(dado.data_operacao);
      const dataFormatada = `${data.getDate()}/
      ${data.getMonth() + 1}/${data.getFullYear()}`;
      novaLista.push({
        id: dado.id,
        descricao: dado.descricao,
        dataOp: dataFormatada,
        valor: dado.valor,
        tipo: dado.tipo,
        investimento: dado.investimento,
        idDepartamento: dado.departamento_id,
        idSetor: dado.setor_id,
        descDepartamento: dado.desc_departamento,
        descSetor: dado.desc_setor,
      });
      if (dado.tipo) {
        novoValor += dado.valor;
      } else {
        novoValor -= dado.valor;
      }
    });
    setListMovimentacao(novaLista);
    setValorTotal(novoValor);
  };
  const calculaValor = (list) => {
    let novoValor = 0;
    list.map((dado) => {
      if (dado.tipo) {
        novoValor += dado.valor;
      } else {
        novoValor -= dado.valor;
      }
    });
    setValorTotal(novoValor);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];
    if (!filtro) {
      setFiltro(true);
      if (descricao.length > 1) {
        membros.map((dados) => {
          if (String(dados.nome).toLowerCase().includes(String(descricao))) {
            novaLista.push(dados);
          }
        });
      } else {
        listMovimentacao.map((dados) => {
          if (dados.idSetor === setorSeletected) {
            novaLista.push(dados);
          }
        });
      }
    } else {
      setFiltro(false);
      axios
        .get('/caixa')
        .then(async (dado) => {
          setListMovimentacao(dado.data);
          renderizaLista(dado.data);
        })
        .then((dado) => dado);
      setCongregacaoId('Selecione a congregação');
    }
    setIsLoading(false);
    calculaValor(novaLista);
    setListMovimentacao(novaLista);
  }
  async function handleDepartamentoSubmit(idDep) {
    setIsLoading(true);
    const novaLista = [];
    if (!filtroDep) {
      setFiltroDep(true);
      listMovimentacao.map((dados) => {
        if (dados.idDepartamento === idDep) {
          novaLista.push(dados);
        }
      });
      setListMovimentacao(novaLista);
      calculaValor(novaLista);
      setDepartamentoId('Selecione o departamento');
    } else {
      setFiltro(false);
      axios.get('/caixa').then(async (dado) => {
        dado.data.map((dados) => {
          if (dados.departamento_id === idDep) {
            novaLista.push(dados);
          }
        });
        renderizaLista(novaLista);
        calculaValor(novaLista);
      });
      setDepartamentoId('Selecione o departamento');
    }
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
      await axios.delete(`/caixa/${idParaDelecao}`);
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
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);
    setores.map((dado) => {
      if (nome === dado.descricao) setSetorSeletected(dado.id);
    });
  };
  const handleInvestimento = (e) => {
    const nome = e.target.value;
    let op;
    setInvestimentoBox(e.target.value);
    setIsLoading(true);
    if (nome === 'Investimento') op = 1;
    else op = 0;

    const novaLista = [];
    if (!filtroDep) {
      setFiltroDep(true);
      listMovimentacao.map((dados) => {
        if (dados.investimento === op) {
          novaLista.push(dados);
        }
      });
      setListMovimentacao(novaLista);
      calculaValor(novaLista);
      setDepartamentoId('Selecione o departamento');
    } else {
      setFiltro(false);
      axios.get('/caixa').then(async (dado) => {
        dado.data.map((dados) => {
          if (dados.investimento === op) {
            novaLista.push(dados);
          }
        });
        renderizaLista(novaLista);
        calculaValor(novaLista);
      });
      setDepartamentoId('Selecione o departamento');
    }
    setIsLoading(false);
  };
  const handleTipo = (e) => {
    const nome = e.target.value;
    let op;
    setTipoBox(e.target.value);
    setIsLoading(true);
    if (nome === 'Entrada') op = 1;
    else op = 0;

    const novaLista = [];
    if (!filtroTipo) {
      setFiltroTipo(true);
      listMovimentacao.map((dados) => {
        if (dados.tipo === op) {
          novaLista.push(dados);
        }
      });
      setListMovimentacao(novaLista);
      calculaValor(novaLista);
      setDepartamentoId('Selecione o departamento');
    } else {
      setFiltro(false);
      axios.get('/caixa').then(async (dado) => {
        dado.data.map((dados) => {
          if (dados.tipo === op) {
            novaLista.push(dados);
          }
        });
        renderizaLista(novaLista);
        calculaValor(novaLista);
      });
      setDepartamentoId('Selecione o departamento');
    }
    setIsLoading(false);
  };
  const handleGetIdDepartamento = (e) => {
    const nome = e.target.value;
    setDepartamentoId(e.target.value);
    let idDep;
    departamentos.map((dado) => {
      if (nome === dado.descricao) {
        idDep = dado.id;
        setDepatamentoSeletected(dado.id);
      }
    });
    handleDepartamentoSubmit(idDep);
  };
  return (
    <Container>
      <h1>Relatório em caixa</h1>
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
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="departamento">
              Filtrar por departamento
              <select onChange={handleGetIdDepartamento} value={departamentoId}>
                <option value="nada">Selecione o departamento</option>
                {departamentos.map((dado) => (
                  <option key={dado.id} value={dado.descricao}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="investimento">
              Investimento/Despesa
              <select onChange={handleInvestimento} value={investimentoBox}>
                <option value="nada">Selecione a opção</option>
                <option value="Investimento">Investimento</option>
                <option value="Despesa">Despesa</option>
              </select>
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="tipo">
              Entrada/Saída
              <select onChange={handleTipo} value={tipoBox}>
                <option value="nada">Selecione a opção</option>
                <option value="Entrada">Entrada</option>
                <option value="Saída">Saída</option>
              </select>
            </Label>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className="my-1">
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
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="valor">Valor:</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={valorTotal}
              onChange={(e) => {
                setDescricao(e.target.value);
              }}
              disabled
            />
          </Col>
        </Row>
        <Row>
          {filtro ? (
            <button type="submit">
              Limpar Filtro <FaSearch />
            </button>
          ) : (
            <button type="submit">
              Filtrar <FaSearch />
            </button>
          )}
        </Row>
      </Form>
      <Listagem>
        <h3>Relatório de Movimentação</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">R.F</th>
                <th scope="col">Data</th>
                <th scope="col">Descrição</th>
                <th scope="col">Valor</th>
                <th scope="col">Movimentação</th>
                <th scope="col">Investimento</th>
                <th scope="col">Departamento</th>
                <th scope="col">Congregação</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {listMovimentacao.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.id}</td>
                  <td>{dado.dataOp}</td>
                  <td>{dado.descricao}</td>
                  <td>{dado.valor}</td>
                  <td>{dado.tipo ? 'Entrada' : 'Saída'}</td>
                  <td>{dado.investimento ? 'Investimento' : 'Despesa'}</td>
                  <td>{dado.descDepartamento}</td>
                  <td>{dado.descSetor}</td>

                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.dep_descricao);
                        history.push(`/caixa/${dado.id}/edit`);
                      }}
                      to={`/caixa/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/relatorioCaixa"
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
