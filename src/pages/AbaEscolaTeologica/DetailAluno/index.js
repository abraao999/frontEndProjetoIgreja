/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import InputMask from 'react-input-mask';
import { isDate } from 'validator';
import { get } from 'lodash';
import { AiOutlineImport } from 'react-icons/ai';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import { Header, Label } from './styled';
import axios from '../../../services/axios';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
import ComboBox from '../../../components/ComboBox';
// import * as actions from '../../store/modules/auth/actions';
export default function DetailAlunoTeologia({ match }) {
  const id = get(match, 'params.id', '');

  const [validated, setValidated] = useState(false);

  const [nomeMembro, setNomeMembro] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cidadeNascimento, setCidadeNascimento] = useState('');
  const [estadoNascimento, setEstadoNascimento] = useState('');
  const [estacoCivil, setEstacoCivil] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [escolaridade, setEscolaridade] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [classe, setClasse] = useState('');
  const [classeId, setClasseId] = useState('');
  const [classes, setClasses] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      if (id) {
        const response = await axios.get(`/teologiaAluno/${id}`);
        console.log(response.data);
        setNomeMembro(response.data.nome);
        setCpf(response.data.cpf);
        setTelefone(response.data.telefone);
        setDataNascimento(response.data.data_nascimento);
        setCidadeNascimento(response.data.cidade_nascimento);
        setEstadoNascimento(response.data.estado_nascimento);
        setEstacoCivil(response.data.estado_civil);
        setNomeMae(response.data.nome_mae);
        setEscolaridade(response.data.escolaridade);
        setCep(response.data.cep);
        setRua(response.data.rua);
        setNumero(response.data.numero);
        setBairro(response.data.bairro);
        setCidade(response.data.cidade);
        setClasse(response.data.desc_classe);
      }

      setIsLoading(false);
    }
    getData();
  }, [id]);
  async function handleSubmit(e) {
    e.preventDefault();
    history.push('/listAlunosTeologia');
  }
  return (
    <Container>
      <h2>Detalhe do Aluno</h2>

      <Loading isLoading={isLoading} />
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="cpf">
              CPF:
              <InputMask
                mask="999.999.999-99"
                id="cpf"
                type="text"
                value={cpf}
                disabled
              />
            </Label>
          </Col>
          <Col sm={12} md={8} className="my-1">
            <Form.Label htmlFor="nome">Nome completo:</Form.Label>
            <Form.Control id="nome" type="text" value={nomeMembro} disabled />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="dataNascimento">
              Data de Nascimento:
            </Form.Label>
            <Form.Control
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              disabled
            />
          </Col>

          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Cidade de Nascimento:</Form.Label>
            <Form.Control
              id="nomeConjuge"
              type="text"
              value={cidadeNascimento}
              disabled
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Estado de Nascimento:</Form.Label>
            <Form.Control
              id="nomeConjuge"
              type="text"
              value={estadoNascimento}
              disabled
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={8} className="my-1">
            <Form.Label htmlFor="cidade">Nome da Mãe:</Form.Label>
            <Form.Control
              id="nomeConjuge"
              type="text"
              value={nomeMae}
              disabled
            />
          </Col>

          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Estado Civil:</Form.Label>
            <Form.Control
              id="nomeConjuge"
              type="text"
              value={estacoCivil}
              disabled
            />
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="telefone">
              Celular:
              <InputMask
                mask="(99) 99999-9999"
                id="telefone"
                type="text"
                value={telefone}
                disabled
              />
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Escolaridade:</Form.Label>
            <Form.Control
              id="nomeConjuge"
              type="text"
              value={escolaridade}
              disabled
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Classe:</Form.Label>
            <Form.Control
              id="nomeConjuge"
              type="text"
              value={classe}
              disabled
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="cep">
              CEP:
              <InputMask
                mask="99999-999"
                id="telefone"
                type="text"
                value={cep}
                disabled
              />
            </Label>
          </Col>
          <Col sm={12} md={8} className="my-1">
            <Form.Label htmlFor="email">Rua:</Form.Label>
            <Form.Control id="rua" type="text" value={rua} disabled />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="numero">Número:</Form.Label>
            <Form.Control id="numero" type="text" value={numero} disabled />
          </Col>

          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="bairro">Bairro:</Form.Label>
            <Form.Control id="bairro" type="text" value={bairro} disabled />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Cidade:</Form.Label>
            <Form.Control id="cidade" type="text" value={cidade} disabled />
          </Col>
        </Row>

        <button type="submit">Voltar</button>
      </Form>
    </Container>
  );
}
DetailAlunoTeologia.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
