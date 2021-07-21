/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose } from 'react-icons/fa';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import { Form, Table, Listagem } from './styled';
import axios from '../../services/axios';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import history from '../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function Departamento({ match }) {
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');
  const [msg, setMsg] = useState(true);

  const [setores, setSetores] = useState([]);
  const [setorSeletected, setSetorSeletected] = useState(0);
  const [comboBoxCongregacao, setComboBoxCongregacao] = useState(
    'Selecione uma congregação'
  );

  const [departamento, setDepartamento] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/departamento');
      setDepartamento(response.data);
      const response2 = await axios.get('/setor');
      setSetores(response2.data);
      console.log(setorSeletected);
      setIsLoading(false);
    }
    getData();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formErrors = false;

    if (
      descricao.length < 3 ||
      descricao.length > 255 ||
      setorSeletected === 0
    ) {
      formErrors = true;
      setIsLoading(false);
      toast.error('Preencha todos os campos');
    }
    if (formErrors) return;
    try {
      if (!id) {
        const response = await axios.post('/departamento', {
          descricao,
          setor_id: setorSeletected,
        });
        console.log(response);
        const novaLista = await axios.get('/departamento');
        setDepartamento(novaLista.data);
        setDescricao('');
        setSetorSeletected(0);
        setComboBoxCongregacao('Selecione uma congregação');
        toast.success('Departamento criada com sucesso');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/departamento/${id}`, {
          descricao,
          setor_id: setorSeletected,
        });
        console.log(response);
        const novaLista = await axios.get('/departamento');
        setDepartamento(novaLista.data);
        setDescricao('');
        setSetorSeletected(0);
        setComboBoxCongregacao('Selecione uma congregação');
        toast.success('Departamento editada com sucesso');

        history.push('/departamento');
        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir uma Classe');
      }
      setIsLoading(false);
    }
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
      await axios.delete(`/departamento/${idParaDelecao}`);
      const novosFuncoes = [...departamento];
      novosFuncoes.splice(indiceDelecao, 1);
      setDepartamento(novosFuncoes);
      toast.success('Departamento excluida com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir a departamento');
      }
      setIsLoading(false);
    }
  };
  const handleGetIdClasse = (e) => {
    const nome = e.target.value;
    setComboBoxCongregacao(e.target.value);
    setores.map((dado) => {
      if (nome === dado.descricao) setSetorSeletected(dado.id);
    });
  };
  return (
    <Container>
      <h1>{id ? 'Editar Departamento' : 'Novo Departamento'}</h1>
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
          <label htmlFor="descricao">
            Nome do departamento:
            <input
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => {
                const banana = document.getElementById('input');
                if (e.target.value.length < 3) {
                  setMsg(false);
                  banana.setAttribute('style', 'border-color:red');
                  banana.style.borderWidth = '2px';
                } else {
                  banana.removeAttribute('style');
                  setMsg(true);
                }
                setDescricao(e.target.value);
              }}
              placeholder="Departamento"
            />
            <small hidden={msg}>Minimo de 3 caracteres</small>
          </label>
          <label htmlFor="congregacao">
            Nome da congregação
            <select onChange={handleGetIdClasse} value={comboBoxCongregacao}>
              <option value="nada">Selecione a congregação</option>
              {setores.map((dado) => (
                <option key={dado.id} value={dado.descricao}>
                  {dado.descricao}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit">Salvar</button>
      </Form>
      <Listagem>
        <h3>Lista de Departamentos</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Departamento</th>
                <th scope="col">Congregação</th>
                <th scope="col">Alterar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {departamento.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.descricao}</td>
                  <td>{dado.setor_descricao}</td>
                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.descricao);
                        history.push(`/departamento/${dado.id}/edit`);
                      }}
                      to={`/departamento/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to={`/departamento/${dado.id}/delete`}
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
Departamento.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
