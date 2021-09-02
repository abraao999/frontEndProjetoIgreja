/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FaSearch } from 'react-icons/fa';

import { useSelector } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import { Label, Listagem, Table } from './styled';
import axios from '../../../services/axios';

import Loading from '../../../components/Loading';
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
} from '../../../util';

export default function RelatorioPresencaGeral({ match }) {
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

  const contadorPresenca = async (listPresenca, alunos) => {
    // contador de presenca
    const novaLista = [];
    const qtdeAlunos = 0;

    console.log(listPresenca);
    alunos.map((aluno) => {
      let contador = 0;

      console.log(contador);
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
    const alunos = [];

    axios.get('/aluno').then((response) => {
      response.data.map((aluno) => {
        if (aluno.classe_id === classeSeletected) alunos.push(aluno);
      });
      setListAlunos(alunos);
    });

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
        if (
          dado.data_aula >= dataInicial &&
          dado.data_aula <= dataFinal &&
          dado.id_classe === classeSeletected
        ) {
          novaList.push(dado);
        }
      });
      contadorPresenca(novaList, alunos);
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
        <Row>
          <Col sm={12} md={6} className="my-1">
            <Label htmlFor="congregacao">
              Selecione a classe
              <select onChange={handleGetIdCongregacao} value={classeNome}>
                <option value="nada">Selecione a classe</option>
                {classes.map((dado) => (
                  <option key={dado.id} value={dado.descricao}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={6} className="my-1">
            <Label htmlFor="trimestre">
              Filtrar por trimestre
              <select onChange={handleIdTrimestre}>
                <option value="nada">Selecione a trimestre</option>
                {trimestres.map((dado) => (
                  <option key={dado.id} value={dado.id}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
        </Row>

        <button type="submit">
          Filtrar <FaSearch />
        </button>
      </Form>
      <Listagem hidden={hidden}>
        <h3>Relatório de Presença</h3>
        <center>
          <Table responsive striped bordered hover>
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
