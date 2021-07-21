/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaSearch, FaSave } from 'react-icons/fa';
import { get } from 'lodash';
import { Container } from '../../styles/GlobalStyles';
import { Form, Table, Listagem } from './styled';
import axios from '../../services/axios';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
// import * as actions from '../../store/modules/auth/actions';

export default function Chamada({ match }) {
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');
  const [filtro, setFiltro] = useState(false);
  const [classes, setClasses] = useState([]);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const [congregacaoId, setCongregacaoId] = useState(
    'Selecione uma congregação'
  );

  const [aluno, setAluno] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aparecer, setAparecer] = useState(true);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/classe');
      setClasses(response.data);
      const response2 = await axios.get('/aluno');
      setAluno(response2.data);
      setIsLoading(false);
    }
    getData();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];

    console.log(filtro);
    if (!filtro) {
      aluno.map((dados) => {
        if (dados.classe_id === setorSeletected) {
          novaLista.push(dados);
        }
      });
      setFiltro(true);
    } else {
      const response = await axios.get('/aluno');
      response.data.map((dados) => {
        if (dados.classe_id === setorSeletected) {
          novaLista.push(dados);
        }
      });
    }
    setAparecer(false);
    setAluno(novaLista);
    setIsLoading(false);
  }

  const handleClose = () => {
    setShow(false);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/aluno/${idParaDelecao}`);
      const novaList = [...aluno];
      novaList.splice(indiceDelecao, 1);
      setAluno(novaList);
      toast.success('Aluno excluido com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir um aluno');
      }
      setIsLoading(false);
    }
  };
  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setCongregacaoId(e.target.value);

    classes.map((dado) => {
      if (nome === dado.descricao) setSetorSeletected(dado.id);
    });
  };
  const listaChamada = [];
  const handleCheck = (dado) => {
    let pula = false;
    if (listaChamada.length > 0) {
      listaChamada.map((item) => {
        if (item === dado) {
          listaChamada.splice(listaChamada.indexOf(item), 1);
          pula = true;
        }
      });
      if (!pula) listaChamada.push(dado);
    } else {
      listaChamada.push(dado);
    }
    console.log(dado);
  };
  const handleSalvar = () => {
    setIsLoading(true);
    if (listaChamada.length === 0)
      return toast.error('A lista de chamada está vazia');
    try {
      listaChamada.map(async (item) => {
        const response = await axios.post('/chamada', {
          data_aula: new Date(),
          aluno_id: item,
        });
      });
      toast.success('Chamada feita com sucesso');
    } catch (error) {
      toast.error('Erro ao atribuir as presenças');
    }
    setIsLoading(false);
  };
  return (
    <Container>
      <h1>Chamada</h1>
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
            Selecione a classe
            <select onChange={handleGetIdCongregacao} value={congregacaoId}>
              <option value="nada">Selecione a classe</option>
              {classes.map((dado) => (
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
      <Listagem hidden={aparecer}>
        <h3>Lista de Alunos</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Classe</th>
                <th scope="col">Presença</th>
              </tr>
            </thead>
            <tbody>
              {aluno.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.nome}</td>
                  <td>{dado.desc_classes}</td>
                  <td>
                    <input
                      onChange={() => handleCheck(dado.id)}
                      type="checkbox"
                      name=""
                      value={check}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <button type="button" onClick={handleSalvar}>
            Salvar <FaSave />
          </button>
        </center>
      </Listagem>
    </Container>
  );
}
Chamada.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
