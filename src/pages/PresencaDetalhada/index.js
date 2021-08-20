/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaWindowClose, FaSearch } from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from '../../styles/GlobalStyles';
import { Form, Table, Listagem } from './styled';
import axios from '../../services/axios';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';

export default function PresencaDetalhada({ match }) {
  const [show, setShow] = useState(false);

  const [congregacaoId, setCongregacaoId] = useState('Selecione uma classe');
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [dataAula, setDataAula] = useState('');

  const [classes, setClasses] = useState([]);
  const [listAlunos, setListAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const dataStorage = useSelector((state) => state.auth);

  useEffect(() => {
    async function getData() {
      const lista = [];
      axios.get('/classe').then((response) => {
        response.data.map((valor) => {
          if (dataStorage.user.setor_id === valor.setor_id) {
            lista.push(valor);
          }
        });
        setClasses(lista);
      });

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
      const data = new Date(dado.data_aula);
      const dataFormatada = `${data.getDate()}/
      ${data.getMonth() + 1}/${data.getFullYear()}`;
      novaLista.push({
        id: dado.id,
        nomeAluno: dado.desc_aluno,
        classeId: dado.setorId,
        classeDesc: dado.desc_classes,
        dataAula: dataFormatada,
      });
    });
    setIsLoading(false);
    setHidden(false);
    setListAlunos(novaLista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const novaList = [];
    if (dataAula) {
      axios.get(`/chamada`).then((dados) => {
        dados.data.map((dado) => {
          console.log(dado.data_aula);
          console.log('data', dataAula);
          if (
            dado.data_aula >= dataAula &&
            dado.id_classe === setorSeletected
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
      await axios.delete(`/chamada/${idParaDelecao}`);
      const novaList = [...listAlunos];
      novaList.splice(indiceDelecao, 1);
      setListAlunos(novaList);
      toast.success('Presença excluida com sucesso');
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
  const handleGetClasseId = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);
    classes.map((dado) => {
      if (nome === dado.descricao) setSetorSeletected(dado.id);
    });
  };

  return (
    <Container>
      <h1>Relatório de presença detalhada</h1>
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
            Filtrar por classe
            <select onChange={handleGetClasseId} value={congregacaoId}>
              <option value="nada">Selecione a classe</option>
              {classes.map((dado) => (
                <option key={dado.id} value={dado.descricao}>
                  {dado.descricao}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="dataAula">
            Data aula
            <input
              type="date"
              value={dataAula}
              onChange={(e) => {
                setDataAula(e.target.value);
              }}
            />
          </label>
        </div>

        <button type="submit">
          Filtrar <FaSearch />
        </button>
      </Form>
      <Listagem hidden={hidden}>
        <h3>Relatório de Presença</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Data da aula</th>
                <th scope="col">Nome do Membro</th>
                <th scope="col">Classe</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {listAlunos.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.dataAula}</td>
                  <td>{dado.nomeAluno}</td>
                  <td>{dado.classeDesc}</td>

                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/PresencaDetalhada"
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
PresencaDetalhada.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
