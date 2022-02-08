/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';
import { Col, Row, Form } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import axios from '../../../services/axios';
import Loading from '../../../components/Loading';
import history from '../../../services/history';

export default function DetailMembro({ match }) {
  const id = get(match, 'params.id', '');

  const [nomeMembro, setNomeMembro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataBatismo, setDataBatismo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [estacoCivil, setEstacoCivil] = useState('');
  const [profissao, setProfissao] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [nomeConjuge, setNomeConjuge] = useState('');
  const [functionNome, setFunctionNome] = useState('');
  const [setor, setSetor] = useState('');
  const [observacao, setObservacao] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [cep, setCep] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get(`/membro/${id}`);
      setNomeMembro(response.data.nome);
      setTelefone(response.data.telefone);
      setEstacoCivil(response.data.estado_civil);
      setProfissao(response.data.profissao);
      setObservacao(response.data.observacao);
      setRua(response.data.rua);
      setNumero(response.data.numero);
      setComplemento(response.data.complemento);
      setBairro(response.data.bairro);
      setCidade(response.data.cidade);
      setEmail(response.data.email);
      setCep(response.data.cep);
      setNomeConjuge(response.data.nomeConjuge);

      const data = new Date(response.data.data_batismo);
      const dataFormatada = `${data.getDate() + 1}/${
        data.getMonth() + 1
      }/${data.getFullYear()}`;
      setDataBatismo(dataFormatada);

      const data2 = new Date(response.data.data_nascimento);
      const dataNasicmentoFormatada = `${data2.getDate() + 1}/${
        data2.getMonth() + 1
      }/${data2.getFullYear()}`;
      setDataNascimento(dataNasicmentoFormatada);

      const response2 = await axios.get(`/setor/${response.data.setor_id}`);
      setSetor(response2.data.descricao);
      const response4 = await axios.get(`/cargo/${response.data.cargo_id}`);
      setCargo(response4.data.descricao);

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
        <Row className="align-items-center">
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="id">Número da ficha:</Form.Label>

            <Form.Control id="id" type="text" value={id} disabled />
          </Col>
          <Col sm={12} md={9} className="my-1">
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
              type="text"
              value={dataNascimento}
              disabled
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="dataBatismo">Data de Batismo:</Form.Label>
            <Form.Control
              id="dataBatismo"
              type="text"
              value={dataBatismo}
              disabled
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="dataBatismo">Celular:</Form.Label>
            <Form.Control id="telefone" type="text" value={telefone} disabled />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="dataBatismo">Estado Civíl:</Form.Label>
            <Form.Control
              id="estadoCivil"
              type="text"
              value={estacoCivil}
              disabled
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Nome do Cônjuge:</Form.Label>
            <Form.Control
              id="nomeConjuge"
              type="text"
              value={nomeConjuge}
              disabled
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="profissao">Profissão:</Form.Label>
            <Form.Control
              id="profissao"
              type="text"
              value={profissao}
              disabled
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataBatismo">Congregação:</Form.Label>
            <Form.Control id="telefone" type="text" value={setor} disabled />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataBatismo">Cargo:</Form.Label>
            <Form.Control id="cargo" type="text" value={cargo} disabled />
          </Col>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="email">E-mail:</Form.Label>
            <Form.Control id="email" type="email" value={email} disabled />
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="email">Rua:</Form.Label>
            <Form.Control id="rua" type="text" value={rua} disabled />
          </Col>
          <Col sm={12} md={2} className="my-1">
            <Form.Label htmlFor="numero">Número:</Form.Label>
            <Form.Control id="numero" type="text" value={numero} disabled />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="complemento">Complemento:</Form.Label>
            <Form.Control
              id="complemento"
              type="text"
              value={complemento}
              disabled
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="bairro">Bairro:</Form.Label>
            <Form.Control id="bairro" type="text" value={bairro} disabled />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Cidade:</Form.Label>
            <Form.Control id="cidade" type="text" value={cidade} disabled />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cep">CEP:</Form.Label>
            <Form.Control id="cep" type="text" value={cep} disabled />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} className="my-1">
            <Form.Label htmlFor="observacao">Observação:</Form.Label>
            <Form.Control
              as="textarea"
              id="observacao"
              type="observacao"
              value={observacao}
              disabled
            />
          </Col>
        </Row>
        <center>
          <Row>
            <Col sm={6} md={6} className="my-1">
              <button type="submit">Alterar</button>
            </Col>
            <Col sm={6} md={6} className="my-1">
              <button
                type="button"
                onClick={() => history.push('/listMembros')}
              >
                Voltar
              </button>
            </Col>
          </Row>
        </center>
      </Form>
    </Container>
  );
}
DetailMembro.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
