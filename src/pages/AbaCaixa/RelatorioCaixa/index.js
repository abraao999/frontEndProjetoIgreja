/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaSearch, FaFilter } from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import pdfMake from 'pdfmake/build/pdfmake';
import { AiFillPrinter } from 'react-icons/ai';

import { useSelector } from 'react-redux';
import { Container } from '../../../styles/GlobalStyles';
import { Header, Label, Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
// import * as actions from '../../store/modules/auth/actions';
import { Impressao } from '../../../printers/impRelatorioDiario';
import { getDataDB } from '../../../util';

export default function RelatorioCaixa() {
  const dataUser = useSelector((state) => state.auth.user);

  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [descricaoId, setDescricaoId] = useState('');
  const [idCongregacao, setIdCongregacao] = useState('');
  const [investimentoBox, setInvestimentoBox] = useState('');
  const [congregacaoBox, setCongregacaoBox] = useState('');
  const [tipoBox, setTipoBox] = useState('');
  const [filtro, setFiltro] = useState(false);
  const [filtroDep, setFiltroDep] = useState(false);
  const [filtroDesc, setFiltroDesc] = useState(false);
  const [filtroInvestimento, setFiltroInvestimento] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState(false);
  const [filtroCongregacao, setFiltroCongregacao] = useState(false);

  const [valorTotal, setValorTotal] = useState(0);
  const [setores, setSetores] = useState([]);
  const [departamentoSeletected, setDepatamentoSeletected] = useState(0);
  const [congregacaoId, setCongregacaoId] = useState(
    'Selecione uma congregação'
  );
  const [departamentoId, setDepartamentoId] = useState(
    'Selecione um departamento'
  );

  const [departamentos, setDepartamentos] = useState([]);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [listDescricao, setListDescricao] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      let auxAutorizado = false;
      if (dataUser.function_id === 1 || dataUser.function_id === 3) {
        setHidden(false);
        auxAutorizado = true;
      }
      const response = await axios.get('/setor');
      setSetores(response.data);
      const response2 = await axios.get('/departamento');
      setDepartamentos(response2.data);
      const response3 = await axios.get('/descCaixa');
      setListDescricao(response3.data);
      const listaFiltrada = [];
      axios.get('/caixa').then(async (dado) => {
        dado.data.map((item) => {
          if (dataUser.setor_id === item.setor_id || auxAutorizado) {
            listaFiltrada.push(item);
          }
        });
        setListMovimentacao(listaFiltrada);
        renderizaLista(listaFiltrada);
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
      const dataFormatada = getDataDB(data);
      const valorConvertido = parseFloat(dado.valor).toFixed(2);
      novaLista.push({
        id: dado.id,
        descricao: dado.descricao,
        nNota: dado.n_nota,
        dataOp: dataFormatada,
        valor: valorConvertido,
        tipo: dado.tipo,
        investimento: dado.investimento,
        idDepartamento: dado.departamento_id,
        idDescricao: dado.desc_id,
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
    novoValor = parseFloat(novoValor).toFixed(2);
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
    novoValor = parseFloat(novoValor).toFixed(2);
    setValorTotal(novoValor);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    setFiltro(false);
    axios.get('/caixa').then(async (dado) => {
      setListMovimentacao(dado.data);
      renderizaLista(dado.data);
      calculaValor(dado.data);
    });

    setIsLoading(false);
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
  async function handleDescricaoSubmit(idDesc) {
    setIsLoading(true);
    const novaLista = [];
    if (!filtroDesc) {
      setFiltroDesc(true);
      listMovimentacao.map((dados) => {
        if (dados.idDescricao === idDesc) {
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
          if (dados.desc_id === idDesc) {
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
  const handleInvestimento = (e) => {
    const nome = e.target.value;
    setInvestimentoBox(nome);
    const novaLista = [];
    if (!filtroInvestimento) {
      setFiltroInvestimento(true);
      listMovimentacao.map((dados) => {
        if (dados.investimento === nome) {
          novaLista.push(dados);
        }
      });
      setListMovimentacao(novaLista);
      calculaValor(novaLista);
      setDepartamentoId('Selecione o departamento');
    } else {
      setFiltroInvestimento(false);
      axios.get('/caixa').then(async (dado) => {
        dado.data.map((dados) => {
          if (dados.investimento === nome) {
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
  const handleCongregacao = (e) => {
    const nome = e.target.value;
    let id;
    setCongregacaoBox(e.target.value);
    setores.map((dado) => {
      if (dado.descricao === nome) {
        setIdCongregacao(dado.id);
        id = dado.id;
      }
    });
    setIsLoading(true);

    const novaLista = [];
    if (!filtroCongregacao) {
      setFiltroCongregacao(true);
      listMovimentacao.map((dados) => {
        if (dados.idSetor === id) {
          novaLista.push(dados);
        }
      });
      setListMovimentacao(novaLista);
      calculaValor(novaLista);
      setDepartamentoId('Selecione o departamento');
    } else {
      setFiltroCongregacao(false);
      axios.get('/caixa').then(async (dado) => {
        dado.data.map((dados) => {
          if (dados.idSetor === id) {
            novaLista.push(dados);
          }
        });
        renderizaLista(novaLista);
        calculaValor(novaLista);
      });
      setCongregacaoBox('Selecione a congregação');
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
      setFiltroTipo(false);
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
  const handleGetIdDescricao = (e) => {
    const nome = e.target.value;
    setDescricao(e.target.value);
    let idDescricao;
    listDescricao.map((dado) => {
      if (nome === dado.descricao) {
        idDescricao = dado.id;
        setDescricaoId(dado.id);
      }
    });
    handleDescricaoSubmit(idDescricao);
  };
  const visualizarImpressao = async () => {
    const novaLista = [];
    listMovimentacao.map((dado) => {
      novaLista.push({
        id: dado.id,
        descricao: dado.descricao,
        nNota: dado.nNota,
        dataOp: dado.dataOp,
        valor: dado.valor,
        tipo: dado.tipo ? 'Entrada' : 'Saída',
        investimento: dado.investimento,
        idDepartamento: dado.departamento_id,
        idSetor: dado.setor_id,
        descDepartamento: dado.desc_departamento,
        descSetor: dado.desc_setor,
      });
    });
    const classeImpressao = new Impressao(novaLista, valorTotal);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
  };
  return (
    <Container>
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
      <Header>
        <h2>Relatório de caixa</h2>
        <button type="button" onClick={visualizarImpressao}>
          <AiFillPrinter size={35} />
        </button>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="departamento">
              Filtrar por departamento
              <select onChange={handleGetIdDepartamento} value={departamentoId}>
                <option value="nada">Selecione o departamento</option>
                {departamentos.map((dado) => (
                  <option key={dado.id} id={dado.id} value={dado.descricao}>
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
                <option value="Outro">Outro</option>
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
            <Label htmlFor="departamento">
              Filtrar por descrição
              <select onChange={handleGetIdDescricao} value={descricao}>
                <option value="nada">Selecione a descrição</option>
                {listDescricao.map((dado) => (
                  <option key={dado.id} id={dado.id} value={dado.descricao}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="congregacao">
              Filtrar por congregação
              <select
                onChange={handleCongregacao}
                value={congregacaoBox}
                disabled={hidden}
              >
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
            <Form.Control id="input" type="text" value={valorTotal} disabled />
          </Col>
        </Row>
        <Row>
          <button type="submit">
            Limpar Filtro <FaFilter />
          </button>
        </Row>
      </Form>
      <Listagem>
        <h3>Relatório de Movimentação</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">R.F</th>
                <th scope="col">Data</th>
                <th scope="col">Nº N.F</th>
                <th scope="col">Descrição</th>
                <th scope="col">Valor</th>
                <th scope="col">Movimentação</th>
                <th scope="col">Investimento</th>
                <th scope="col">Departamento</th>
                <th scope="col">Congregação</th>
                {/* <th scope="col">Editar</th>
                <th scope="col">Excluir</th> */}
              </tr>
            </thead>
            <tbody>
              {listMovimentacao.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.id}</td>
                  <td>{dado.dataOp}</td>
                  <td>{dado.nNota}</td>
                  <td>{dado.descricao}</td>
                  <td>{dado.valor}</td>
                  <td>{dado.tipo ? 'Entrada' : 'Saída'}</td>
                  <td>{dado.investimento}</td>
                  <td>{dado.descDepartamento}</td>
                  <td>{dado.descSetor}</td>

                  {/* <td>
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
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
    </Container>
  );
}
