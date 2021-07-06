/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose, FaSearch } from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from '../../styles/GlobalStyles';
import { Form, Table, Listagem } from './styled';
import axios from '../../services/axios';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import history from '../../services/history';
import ModalMembro from '../../components/ModalMembro';

export default function RelatorioPresencaGeral({ match }) {
  const [show, setShow] = useState(false);

  const [congregacaoId, setCongregacaoId] = useState('Selecione uma classe');
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  const [classes, setClasses] = useState([]);
  const [listAlunos, setListAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const dataStorage = useSelector((state) => state.auth);
  const [presenca, setPresenca] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get('/classe');
      const listaClasse = [];
      response.data.map((dado) => {
        if (dado.setor_id === dataStorage.user.setor_id) {
          listaClasse.push(dado);
        }
      });
      setClasses(listaClasse);
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
        classeId: dado.id_classe,
        classeDesc: dado.desc_classes,
        dataAula: dataFormatada,
      });
    });
    setIsLoading(false);
    setHidden(false);
    setListAlunos(novaLista);
    contadorPresenca(novaLista);
  };

  const contadorPresenca = (list) => {
    const novaLista = [];
    classes.map((classe) => {
      let contador = 0;
      list.map((dado) => {
        if (dado.classeId === classe.id) {
          contador += 1;
        }
      });
      novaLista.push({
        idClasse: classe.id,
        nomeClasse: classe.descricao,
        contador,
      });
    });
    setPresenca(novaLista);
    console.log(novaLista);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const novaList = [];
    if (dataInicial && dataFinal) {
      axios.get(`/chamada`).then((dados) => {
        dados.data.map((dado) => {
          if (dado.data_aula >= dataInicial && dado.data_aula <= dataFinal) {
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

  return (
    <Container>
      {/* <h1>Relatório de presença geral {isLoggedIn}</h1> */}
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
      <Listagem hidden={hidden}>
        <h3>Relatório de Presença</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Nome da Classe</th>
                <th scope="col">Total de presenca</th>
                {/* <th scope="col">Excluir</th> */}
              </tr>
            </thead>
            <tbody>
              {presenca.map((dado, index) => (
                <tr key={String(dado.idClasse)}>
                  <td>{dado.nomeClasse}</td>
                  <td>{dado.contador}</td>

                  {/* <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/relatorioPresencaEbd"
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
RelatorioPresencaGeral.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
