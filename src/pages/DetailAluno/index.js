/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import InputMask from 'react-input-mask';
import { get } from 'lodash';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import history from '../../services/history';

export default function DetailAluno({ match }) {
  const id = get(match, 'params.id', '');

  const [nomeMembro, setNomeMembro] = useState('');

  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  const [dataNascimento, setDataNascimento] = useState('');
  const [classe, setClasse] = useState('');
  const [setor, setSetor] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get(`/aluno/${id}`);
      setNomeMembro(response.data.nome);
      setCpf(response.data.cpf);

      const data2 = new Date(response.data.data_aniversario);
      const dataForm = `${data2.getDate()}/${data2.getMonth() + 1
        }/${data2.getFullYear()}`;
      setDataNascimento(dataForm);

      setTelefone(response.data.telefone);

      const response2 = await axios.get(`/setor/${response.data.setor_id}`);
      setSetor(response2.data.descricao);

      const response3 = await axios.get(`/classe/${response.data.classe_id}`);
      console.log(response3.data);
      setClasse(response3.data.descricao);

      setIsLoading(false);
    }
    getData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    history.push(`/cadAluno/${id}/edit`);
  }

  return (
    <Container>
      <h1> Detalhes do Aluno</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">
            Nome completo:
            <input type="text" value={nomeMembro} disabled />
          </label>
        </div>
        <div>
          <label htmlFor="cpf">
            CPF:
            <InputMask
              mask="999.999.999-99"
              id="cpf"
              type="text"
              value={cpf}
              disabled
            />
          </label>
        </div>
        <div>
          <label htmlFor="dataNascimento">
            Data de Nascimento:
            <input type="text" value={dataNascimento} disabled />
          </label>
          <label htmlFor="telefone">
            Celular:
            <InputMask
              mask="(99) 99999-9999"
              type="text"
              value={telefone}
              disabled
            />
          </label>
        </div>
        <div>
          <label htmlFor="classe">
            Classe:
            <input type="text" value={classe} disabled />
          </label>
          <label htmlFor="setor">
            Congregação:
            <input type="text" value={setor} disabled />
          </label>
        </div>
        <span>
          <button type="submit">Alterar</button>
          <button type="button" onClick={() => history.push('/listAluno')}>
            Voltar
          </button>
        </span>
      </Form>
    </Container>
  );
}
DetailAluno.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
