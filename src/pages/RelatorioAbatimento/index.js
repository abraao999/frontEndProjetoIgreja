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
// import * as actions from '../../store/modules/auth/actions';

export default function RelatorioAbatimento({ match }) {
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');
  const [filtro, setFiltro] = useState(false);

  const [setores, setSetores] = useState([]);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const [congregacaoId, setCongregacaoId] = useState(
    'Selecione uma congregação'
  );

  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/setor');
      setSetores(response.data);

      axios
        .get('/abatimento')
        .then(async (dado) => {
          setListMovimentacao(dado.data);
          renderizaLista(dado.data);
        })
        .then((dado) => dado);
      setIsLoading(false);
    }
    getData();
  }, []);

  const renderizaLista = (list) => {
    const novaLista = [];
    list.map((dado) => {
      const data = new Date(dado.data_operacao);
      const dataFormatada = `${data.getDate()}/${data.getMonth() + 1
        }/${data.getFullYear()}`;
      novaLista.push({
        id: dado.id,
        descricao: dado.descricao,
        dataOp: dataFormatada,
        valor: dado.valor,
        idDepartamento: dado.departamento_id,
        idSetor: dado.setor_id,
        descDepartamento: dado.desc_departamento,
        descSetor: dado.desc_setor,
      });
    });
    setListMovimentacao(novaLista);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];
    if (!filtro) {
      setFiltro(true);
      listMovimentacao.map((dados) => {
        if (dados.idSetor === setorSeletected) {
          novaLista.push(dados);
        }
      });
      setListMovimentacao(novaLista);
    } else {
      axios.get('/abatimento').then(async (dado) => {
        dado.data.map((dados) => {
          if (dados.setor_id === setorSeletected) {
            novaLista.push(dados);
          }
        });
        renderizaLista(novaLista);
      });
      setCongregacaoId('Selecione a congregação');
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

  return (
    <Container>
      <h1>Relatório de Abatimento</h1>
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
        </div>

        <button type="submit">
          Filtrar <FaSearch />
        </button>
      </Form>
      <Listagem>
        <h3>Relatório de Abatimento</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">R.E</th>
                <th scope="col">Data</th>
                <th scope="col">Descrição</th>
                <th scope="col">Valor</th>
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
                  <td>{dado.descSetor}</td>

                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.dep_descricao);
                        history.push(`/abatimento/${dado.id}/edit`);
                      }}
                      to={`/abatimento/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/relatorioAbatimento"
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
RelatorioAbatimento.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
