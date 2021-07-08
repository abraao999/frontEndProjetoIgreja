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
import {
  fimPrimeiroTrimestre,
  fimQuartoTrimestre,
  fimSegundoTrimestre,
  fimTerceiroTrimestre,
  inicioPrimeiroTrimestre,
  inicioQuartoTrimestre,
  inicioSegundoTrimestre,
  inicioTerceiroTrimestre,
  trimestres,
} from '../../util';

export default function RelatorioPresencaGeral({ match }) {
  const [show, setShow] = useState(false);

  const [classes, setClasses] = useState([]);
  const [listAlunos, setListAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [classeSeletected, setClasseSeletected] = useState(0);
  const [classeNome, setClasseNome] = useState('');
  const [presenca, setPresenca] = useState([]);

  const dataStorage = useSelector((state) => state.auth);

  const [idTrimestre, setIdTrimestre] = useState('');
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

  const contadorPresenca = async (listPresenca) => {
    // contador de presenca
    const novaLista = [];
    const qtdeAlunos = 0;

    console.log(listPresenca);
    listAlunos.map((aluno) => {
      let contador = 0;

      listPresenca.map((dado) => {
        if (dado.aluno_id === aluno.id) {
          contador += 1;
        }
      });

      // 100 --- 13
      // x --- presenca
      // x = (presenca*100)/13
      // renderiza a lista com os dados
      novaLista.push({
        id: aluno.id,
        nomeAluno: aluno.nome,
        frequencia: contador,
        faltas: 13 - contador,
        porcentagem: ((contador * 100) / 13).toFixed(2),
      });
    });
    setHidden(false);
    setPresenca(novaLista);
    console.log(novaLista);
    setIsLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let dataInicial;
    let dataFinal;
    setIsLoading(true);
    const novaList = [];

    switch (idTrimestre) {
      case 0: {
        dataInicial = inicioPrimeiroTrimestre;
        dataFinal = fimPrimeiroTrimestre;

        break;
      }
      case 1: {
        dataInicial = inicioSegundoTrimestre;
        dataFinal = fimSegundoTrimestre;

        break;
      }
      case 2: {
        dataInicial = inicioTerceiroTrimestre;
        dataFinal = fimTerceiroTrimestre;

        break;
      }
      case 3: {
        dataInicial = inicioQuartoTrimestre;
        dataFinal = fimQuartoTrimestre;

        break;
      }

      default:
        break;
    }
    axios.get(`/chamada`).then((dados) => {
      dados.data.map((dado) => {
        // const banana = new Date(dado.data_aula);
        console.log(dado.data_aula);
        if (
          dado.data_aula >= dataInicial &&
          dado.data_aula <= dataFinal &&
          dado.id_classe === classeSeletected
        ) {
          novaList.push(dado);
        }
      });
      contadorPresenca(novaList);
      console.log(novaList);
    });
  };
  const handleIdTrimestre = async (e) => {
    const valor = Number(e.target.value);

    setIdTrimestre(valor);
  };
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setClasseNome(e.target.value);

    classes.map((dado) => {
      if (nome === dado.descricao) setClasseSeletected(dado.id);
    });
  };
  return (
    <Container>
      <h1>Relatório de presença geral </h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="congregacao">
            Selecione a classe
            <select onChange={handleGetIdCongregacao} value={classeNome}>
              <option value="nada">Selecione a classe</option>
              {classes.map((dado) => (
                <option key={dado.id} value={dado.descricao}>
                  {dado.descricao}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="trimestre">
            Filtrar por trimestre
            <select onChange={handleIdTrimestre}>
              <option value="nada">Selecione a classe</option>
              {trimestres.map((dado) => (
                <option key={dado.id} value={dado.id}>
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
      <Listagem hidden={hidden}>
        <h3>Relatório de Presença</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Nome da Classe</th>
                <th scope="col">Total de presença</th>
                <th scope="col">Total de faltas</th>
                <th scope="col">Percentual de presença</th>
                {/* <th scope="col">Excluir</th> */}
              </tr>
            </thead>
            <tbody>
              {presenca.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.nomeAluno}</td>
                  <td>{dado.frequencia}</td>
                  <td>{dado.faltas}</td>
                  <td>{dado.porcentagem}</td>

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
