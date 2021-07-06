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
      const alunos = await axios.get('/aluno');
      setListAlunos(alunos.data);
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
    setHidden(false);
    contadorPresenca(novaLista);
  };

  const contadorPresenca = async (list) => {
    // contador de presenca
    const novaLista = [];
    classes.map((classe) => {
      let alunosPresente = 0;
      let qtdeAlunos = 0;

      listAlunos.map((aluno) => {
        if (aluno.classe_id === 6) {
          qtdeAlunos += 1;
        }
      });

      list.map((dado) => {
        if (dado.classeId === classe.id) {
          alunosPresente += 1;
        }
      });

      // renderiza a lista com os dados
      novaLista.push({
        idClasse: classe.id,
        nomeClasse: classe.descricao,
        alunosPresente,
        qtdeAlunos,
        faltas: qtdeAlunos - alunosPresente,
      });
    });
    setPresenca(novaLista);
    console.log(novaLista);
    setIsLoading(false);
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

  return (
    <Container>
      <h1>Relatório de presença geral </h1>
      <Loading isLoading={isLoading} />

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
                <th scope="col">Total de aluno</th>
                <th scope="col">Total de presenca</th>
                <th scope="col">Total de faltas</th>
                {/* <th scope="col">Excluir</th> */}
              </tr>
            </thead>
            <tbody>
              {presenca.map((dado, index) => (
                <tr key={String(dado.idClasse)}>
                  <td>{dado.nomeClasse}</td>
                  <td>{dado.qtdeAlunos}</td>
                  <td>{dado.alunosPresente}</td>
                  <td>{dado.faltas}</td>

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
