/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaWindowClose, FaSearch } from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import { Label, Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
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
  trimestres, getDataBanco
} from '../../../util'
export default function PresencaPessoal({ match }) {
  const [show, setShow] = useState(false);

  const [congregacaoId, setCongregacaoId] = useState('Selecione uma classe');
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [alunoId, setAlunoId] = useState('');

  const [classes, setClasses] = useState([]);
  const [listAlunos, setListAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [idTrimestre, setIdTrimestre] = useState('');
  const [setorSeletected, setSetorSeletected] = useState(0);
  const dataUser = useSelector((state) => state.auth.user);
  const anos = [{ id: 0, descricao: '2021' }, { id: 1, descricao: '2022' }]
  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      const response = await axios.get('/aluno')
      let naoEncontrado = true
      response.data.map((dado) => {
        if (dado.cpf === dataUser.cpf) { setAlunoId(dado.id); naoEncontrado = false }

      });
      if (naoEncontrado) toast.error('Aluno não encontrado, favor verifique com o secretário da ebd')
      setIsLoading(false)


    }
    getData();
  }, []);

  const renderizaLista = (list, mes) => {
    const novaLista = [];
    list.map((dado) => {
      const data = new Date(dado.data_aula);
      const dataFormatada = getDataBanco(data)
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
  const handleIdTrimestre = async (e) => {
    const valor = Number(e.target.value);

    setIdTrimestre(valor);
    console.log(e.target.value);
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
        if (
          dado.data_aula >= dataInicial &&
          dado.data_aula <= dataFinal &&
          dado.aluno_id === alunoId
        ) {
          novaList.push(dado);
        }
      });
      renderizaLista(novaList);
      console.log(novaList);
    });
  };
  const handleClose = () => {
    setShow(false);
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
      <h1>Minha presença na EBD</h1>
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

          <Col sm={12} md={5} className="my-1">
            <Label htmlFor="congregacao">
              Selecione o Trimestre
              <select onChange={handleIdTrimestre} >
                <option value="nada">Selecione o trimestre</option>
                {trimestres.map((dado) => (
                  <option key={dado.id} value={dado.id}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type='submit'><FaSearch size={16} /> Buscar</button>
          </Col>

        </Row>

      </Form>
      <Listagem hidden={hidden}>
        <h3>Relatório de Presença</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Data da aula</th>
                <th scope="col">Nome do Membro</th>
                <th scope="col">Classe</th>
              </tr>
            </thead>
            <tbody>
              {listAlunos.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.dataAula}</td>
                  <td>{dado.nomeAluno}</td>
                  <td>{dado.classeDesc}</td>

                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
    </Container>
  );
}
PresencaPessoal.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
