/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import InputMask from 'react-input-mask';
import { get } from 'lodash';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import history from '../../services/history';

export default function DetailMembro({ match }) {
  const id = get(match, 'params.id', '');

  const [nomeMembro, setNomeMembro] = useState('');
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataBatismo, setDataBatismo] = useState('');
  const [estacoCivil, setEstacoCivil] = useState('');
  const [profissao, setProfissao] = useState('');
  const [cargo, setCargo] = useState('');
  const [functionNome, setFunctionNome] = useState('');
  const [setor, setSetor] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get(`/membro/${id}`);
      setNomeMembro(response.data.nome);
      setRg(response.data.rg);
      setCpf(response.data.cpf);

      const data = new Date(response.data.data_batismo);
      const dataFormatada = `${data.getDate()}/${
        data.getMonth() + 1
      }/${data.getFullYear()}`;
      setDataBatismo(dataFormatada);
      setTelefone(response.data.telefone);
      setEstacoCivil(response.data.estado_civil);
      setProfissao(response.data.profissao);

      const response2 = await axios.get(`/setor/${response.data.setor_id}`);
      setSetor(response2.data.descricao);
      const response4 = await axios.get(`/cargo/${response.data.cargo_id}`);
      setCargo(response4.data.descricao);

      const response3 = await axios.get(`/funcao/${response.data.setor_id}`);
      console.log(response3.data);
      setFunctionNome(response3.data.descricao);

      setIsLoading(false);
    }
    getData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    history.push(`/cadMembro/${id}/edit`);
  }
  return (
    <Container>
      <h1> Detalhes do Membro</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">
            Nome completo:
            <input type="text" value={nomeMembro} disabled />
          </label>
        </div>
        <div>
          <label htmlFor="rg">
            RG:
            <input id="rg" type="text" value={rg} disabled />
          </label>
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
          <label htmlFor="dataBatismo">
            Data de Batismo:
            <input type="text" value={dataBatismo} disabled />
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
          <label htmlFor="telefone">
            Estado Civil:
            <input type="text" value={estacoCivil} disabled />
          </label>
          <label htmlFor="profissao">
            Profissão:
            <input id="profissao" type="text" value={profissao} disabled />
          </label>
        </div>
        <div>
          <label htmlFor="cargo">
            Cargo:
            <input type="text" value={cargo} disabled />
          </label>
          <label htmlFor="funcao">
            Função:
            <input type="text" value={functionNome} disabled />
          </label>
          <label htmlFor="setor">
            Congregação:
            <input type="text" value={setor} disabled />
          </label>
        </div>
        <span>
          <button type="submit">Alterar</button>
          <button type="button" onClick={() => history.push('/listMembros')}>
            Voltar
          </button>
        </span>
      </Form>
    </Container>
  );
}
DetailMembro.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
