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
  FaInfo,
  FaSave,
} from 'react-icons/fa';
import InputMask from 'react-input-mask';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  Row,
  Table,
  ToggleButton,
} from 'react-bootstrap';
import { AiFillPrinter } from 'react-icons/ai';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Container } from '../../../styles/GlobalStyles';
import { Header, Label, Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
import ModalMembro from '../../../components/ModalMembro';
import { listMeses } from '../../../util';

import { Impressao } from '../../../printers/impRelatorioDizimoIndividual';
import ComboBox from '../../../components/ComboBox';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function TeologiaLivro() {
  const [show, setShow] = useState(false);
  const [showMembro, setShowMembro] = useState(false);

  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [idMembro, setIdMembro] = useState('');
  const [nomeMembro, setNomeMembro] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataOp, setDataOp] = useState('');

  const [membros, setMembros] = useState([]);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [ano, setAno] = useState('2021');
  const [mes, setMes] = useState('');
  const [status, setStatus] = useState('vazio');

  const renderizaLista = (list) => {
    const novaLista = [];
    listMeses.map((mess) => {
      let mesEncontrado = 'vazio';

      list.map((membro) => {
        const data = new Date(membro.data_operacao);

        if (data.getMonth() === mess.id) {
          if (membro.status === 'entregue') mesEncontrado = 'entregue';
          else if (membro.status === 'pago') mesEncontrado = 'pago';
        }
      });
      novaLista.push({
        id: mess.id,
        mesEncontrado,
        descricao: mess.descricao,
      });
    });
    setIsLoading(false);
    setListMovimentacao(novaLista);
    console.log(novaLista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const list = [];
    if (idMembro) {
      axios.get(`/teologiaLivro/pesquisaData/${idMembro}`).then((dado) => {
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
      const statuser = get(error, 'response.data.status', 0);
      if (statuser === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir a membro');
      }
      setIsLoading(false);
    }
  };

  const handleIdMembro = async (idm) => {
    try {
      const response = await axios.get(`/teologiaAluno/${idm}`);
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
      const response = await axios.get('/teologiaAluno');
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
    setAno(valor);
  };
  const handleStatus = async (e) => {
    const valor = String(e.target.value);
    console.log(valor);
    setStatus(valor);
  };
  const visualizarImpressao = async () => {
    const novaLista = [];
    listMovimentacao.map((dado) => {
      novaLista.push({
        nome: dado.descricao,
        mesEntrege: dado.mesEncontrado ? 'Entregue' : 'Não Entregue',
        nada: dado.mesEncontrado ? 'Entregue' : 'Não Entregue',
      });
    });
    const classeImpressao = new Impressao(novaLista);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
  };
  const handleCpfAluno = async (e) => {
    try {
      const response = await axios.get('/teologiaAluno');
      response.data.map((dados) => {
        if (
          String(dados.cpf).toLowerCase().includes(String(cpf.toLowerCase()))
        ) {
          setNomeMembro(dados.nome);
          setCpf(dados.cpf);
          setIdMembro(dados.id);
        }
      });
    } catch (er) {
      toast.error('Condigo não existe');
      console.log(er);
    }
  };
  const handleMes = (e) => {
    setMes(e.target.value);
  };
  const handleSalvar = async () => {
    const data = new Date(ano, mes, 2);
    axios.post('/teologiaLivro', {
      data_operacao: data,
      aluno_id: idMembro,
      status,
    });
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <ModalMembro
        title="Selecione o Aluno"
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
      <Header>
        <h2>Entrega de Livros</h2>
        <button type="button" onClick={visualizarImpressao}>
          <AiFillPrinter size={35} />
        </button>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Label htmlFor="cpf">
              CPF:
              <InputMask
                mask="999.999.999-99"
                id="cpf"
                type="text"
                value={cpf}
                onChange={(e) => {
                  setCpf(e.target.value);
                  // handleInput(e, 'cpf');
                }}
                onBlur={(e) => handleCpfAluno(e)}
                placeholder="000.000.000-00"
              />
              {/* <small>Minimo de 3 caracteres</small> */}
            </Label>
          </Col>

          <Col sm={12} md={6} className="my-1">
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
      <Listagem hidden={false}>
        <h3>Status</h3>
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
                <th scope="col">Nome do mês</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {listMovimentacao.map((dado) => (
                <tr key={String(dado.id)}>
                  <td>{dado.descricao}</td>
                  <td>
                    {/* {dado.mesEncontrado === 'pago' && <FaCheck size={12} />}
                    {dado.mesEncontrado === 'vazio' && (
                      <FaWindowClose size={12} color="red" />
                    )} */}

                    <Button
                      variant="success"
                      hidden={dado.mesEncontrado !== 'pago'}
                    >
                      <FaCheck />
                    </Button>
                    <Button
                      variant="danger"
                      hidden={dado.mesEncontrado !== 'vazio'}
                    >
                      <FaWindowClose />
                    </Button>
                    <Button
                      variant="warning"
                      hidden={dado.mesEncontrado !== 'entregue'}
                    >
                      <FaInfo />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="departamento">
              Status
              <select onChange={handleMes}>
                <option value="">Selecione a opção</option>
                {listMeses.map((dado) => (
                  <option key={dado.id} value={dado.id}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="departamento">
              Status
              <select onChange={handleStatus}>
                <option value="">Selecione a opção</option>
                <option value="entregue">Entregue</option>
                <option value="pago">Entregue e Pago</option>
              </select>
            </Label>
          </Col>
          <Col
            sm={12}
            md={4}
            className="my-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <button
              type="button"
              onClick={(e) => {
                handleSalvar();
              }}
            >
              Salvar <FaSave />
            </button>
          </Col>
        </Row>
      </Listagem>
    </Container>
  );
}
