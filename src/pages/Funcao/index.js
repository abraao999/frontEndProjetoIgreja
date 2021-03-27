import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import Loading from '../../components/Loading';
// import * as actions from '../../store/modules/auth/actions';

export default function Funcao() {
  const dispath = useDispatch();
  const [descricao, setDescricao] = useState('');

  const isLoading = useSelector((state) => state.auth.isLoading);

  async function handleSubmit(e) {
    e.preventDefault();

    let formErrors = false;

    if (descricao.length < 3 || descricao.length > 255) {
      formErrors = true;
      toast.error('Campo descricao deve ter entre 3 e 255 caracteres');
    }
    // if (formErrors) return;
    // dispath(actions.registerRequest({ descricao }));
  }
  return (
    <Container>
      <h1>Criar Funções</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <label htmlFor="descricao">
          Nome da função:
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Função"
          />
        </label>
        <button type="submit">Salvar</button>
      </Form>
    </Container>
  );
}
