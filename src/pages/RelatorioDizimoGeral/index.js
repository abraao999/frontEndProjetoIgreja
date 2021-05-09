/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaSearch } from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import { Form, Table, Listagem } from './styled';
import axios from '../../services/axios';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import history from '../../services/history';
import ModalMembro from '../../components/ModalMembro';

export default function RelatorioDizimoGeral({ match }) {
  const [show, setShow] = useState(false);
  const [showMembro, setShowMembro] = useState(false);

  const [filtroDep, setFiltroDep] = useState(false);
  const [congregacaoId, setCongregacaoId] = useState(
    'Selecione uma congregação'
  );
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [idMembro, setIdMembro] = useState('');
  const [nomeMembro, setNomeMembro] = useState('');

  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  const [setores, setSetores] = useState([]);
  const [membros, setMembros] = useState([]);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [setorSeletected, setSetorSeletected] = useState(0);

  useEffect(() => {
    async function getData() {
      const response = await axios.get('/setor');
      setSetores(response.data);

      // const mes = new Date().getMonth();
      // axios.get(`/dizimo`).then((dado) => {
      //   renderizaLista(dado.data, mes);
      // });
    }
    getData();
  }, []);

  const renderizaLista = (list, mes) => {
    const novaLista = [];
    list.map((dado) => {
      const data = new Date(dado.data_operacao);
      const dataFormatada = `${data.getDate()}/${
        data.getMonth() + 1
      }/${data.getFullYear()}`;
      if (data.getMonth() === mes) {
        novaLista.push({
          id: dado.id,
          nomeMembro: dado.nome,
          setorId: dado.setorId,
          setorDesc: dado.setorDesc,
          dataOp: dataFormatada,
        });
      } else {
        novaLista.push({
          id: dado.id,
          nomeMembro: dado.nome,
          setorId: dado.setorId,
          setorDesc: dado.setorDesc,
          dataOp: dataFormatada,
        });
      }
    });
    setIsLoading(false);
    setListMovimentacao(novaLista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const novaList = [];
    if (dataInicial && dataFinal) {
      axios.get(`/dizimo`).then((dados) => {
        dados.data.map((dado) => {
          console.log(congregacaoId);
          if (
            dado.data_operacao >= dataInicial &&
            dado.data_operacao <= dataFinal &&
            dado.setorDesc === congregacaoId
          ) {
            novaList.push(dado);
          }
        });
        renderizaLista(novaList);
      });
    } else {
      toast.error('Selecione todos os campos para filtrar');
      setIsLoading(false);
    }
  };

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
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);
    setores.map((dado) => {
      if (nome === dado.descricao) setSetorSeletected(dado.id);
    });
  };

  return (
    <Container>
      <h1>Relatório de dízimo geral</h1>
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
        <div>
          <label htmlFor="congregacao">
            Filtrar por congregação
            <select onChange={handleGetIdCongregacao} value={congregacaoId}>
              <option value="nada">Selecione a congregação</option>
              {setores.map((dado) => (
                <option key={dado.id} value={dado.descricao}>
                  {dado.descricao}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="dataInicial">
            Data Inicial
            <input
              type="date"
              value={dataInicial}
              onChange={(e) => {
                setDataInicial(e.target.value);
              }}
            />
          </label>
          <label htmlFor="dataInicial">
            Data Final
            <input
              type="date"
              value={dataFinal}
              onChange={(e) => {
                setDataFinal(e.target.value);
              }}
            />
          </label>
        </div>

        <button type="submit">
          Filtrar <FaSearch />
        </button>
      </Form>
      <Listagem>
        <h3>Relatório de dizimo</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Nome do Membro</th>
                <th scope="col">Congregação</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {listMovimentacao.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.dataOp}</td>
                  <td>{dado.nomeMembro}</td>
                  <td>{dado.setorDesc}</td>

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
RelatorioDizimoGeral.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
