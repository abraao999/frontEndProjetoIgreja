import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import { Form, Titulo } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

// eslint-disable-next-line react/prop-types
export default function Fotos({ match }) {
  const id = get(match, 'params.id', '');
  const [isLoding, setIsLoading] = useState(false);
  const [foto, setFoto] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        setFoto(get(data, 'Fotos[0].url', ''));
        setIsLoading(false);
      } catch {
        toast.error('Erro obter imagen');
        setIsLoading(false);
        history.push('/');
      }
    };
  }, []);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    const fotoUrl = URL.createObjectURL(file);
    setFoto(fotoUrl);
    const formData = new FormData();
    formData.append('aluno_id', id);
    formData.append('foto', file);
    try {
      setIsLoading(true);
      const response = await axios.post('/fotos', formData, {
        headers: { 'Content-Type': 'multipart/form-data ' },
      });
      toast.success('Foto enviada com sucesso');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const status = get(error, 'response', '');
      toast.error('Erro ao enviar foto');

      if (status === 401) {
        dispatch(actions.loginFailure());
      }
    }
  };
  return (
    <Container>
      <Loading isLoading={isLoding} />
      <Titulo>Fotos</Titulo>
      <Form>
        <label htmlFor="foto">
          {foto ? <img src={foto} alt="Foto" /> : 'Selecionar'}
          <input type="file" id="foto" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Fotos.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
