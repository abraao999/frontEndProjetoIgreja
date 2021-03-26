import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmail, isInt, isFloat } from 'validator';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import * as actions from '../../store/modules/auth/actions';
import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Titulo } from './styled';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import history from '../../services/history';
// eslint-disable-next-line react/prop-types
export default function Aluno({ match }) {
  const id = get(match, 'params.id', '');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [foto, setFoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispath = useDispatch();

  useEffect(() => {
    if (!id) return;
    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        const Foto = get(data, 'Fotos[0].url', '');
        setFoto(Foto);
        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setPeso(data.peso);
        setAltura(data.altura);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        const status = get(error, 'response.status', 0);
        const errors = get(error, 'response.errors', []);
        if (status === 400) {
          errors.map((es) => toast.error(es));
        }
        history.push('/');
      }
    }
    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;
    if (nome.length < 3 || nome > 255) {
      formErrors = true;
      toast.error('Nome precisa ter entre 3 e 255 caracteress');
    }
    if (sobrenome.length < 3 || sobrenome > 255) {
      formErrors = true;
      toast.error('Nome precisa ter entre 3 e 255 caracteress');
    }
    if (!isEmail(email)) {
      formErrors = true;
      toast.error('E-mail invalido');
    }
    if (!isInt(String(idade))) {
      formErrors = true;
      toast.error('Idade invalido');
    }
    if (!isFloat(String(peso))) {
      formErrors = true;
      toast.error('peso invalido');
    }
    if (!isFloat(String(altura))) {
      formErrors = true;
      toast.error('altura invalido');
    }
    if (formErrors) return;
    try {
      setIsLoading(true);
      if (id) {
        const response = await axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success('Aluno editado com sucesso');
      } else {
        const { data } = await axios.post(`/alunos/`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success('Aluno cadastrado com sucesso');
        console.log(data);
        history.push(`/aluno/${data.id}/edit`);
      }
      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.status', 0);
      const data = get(error, 'response.data', {});
      const err = get(data, 'erros', []);
      if (err.length > 0) err.map((es) => toast.error(es));
      else toast.error('Erro desconhecido');

      if (status === 401) {
        dispath(actions.loginFailure());
      }
    }
  };
  return (
    <Container>
      <Titulo>{id ? 'Editar Aluno' : 'Novo Aluno'}</Titulo>
      {id && (
        <ProfilePicture>
          {foto ? <img src={foto} alt={nome} /> : <FaUserCircle size={180} />}
          <Link to={`/fotos/${id}`}>
            <FaEdit size={24} />{' '}
          </Link>
        </ProfilePicture>
      )}
      <Loading isLoading={isLoading} />
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          placeholder="Nome"
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          value={sobrenome}
          placeholder="Sobrenome"
          onChange={(e) => setSobrenome(e.target.value)}
        />
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          value={idade}
          placeholder="Idade"
          onChange={(e) => setIdade(e.target.value)}
        />
        <input
          type="text"
          value={peso}
          placeholder="Peso"
          onChange={(e) => setPeso(e.target.value)}
        />
        <input
          type="text"
          value={altura}
          placeholder="Altura"
          onChange={(e) => setAltura(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </Form>
    </Container>
  );
}

Aluno.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
