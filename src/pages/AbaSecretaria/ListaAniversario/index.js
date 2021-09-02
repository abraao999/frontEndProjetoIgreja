/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';

import { FaSearch } from 'react-icons/fa';

import { useSelector } from 'react-redux';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../../styles/GlobalStyles';
import { Label, Listagem } from './styled';
import axios from '../../../services/axios';

import Loading from '../../../components/Loading';
import { getDataDB, listMeses } from '../../../util';

export default function ListaAniversario() {
  const [membros, setMembros] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [setors, setSetors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [classeSeletected, setClasseSeletected] = useState(0);
  const [mes, setMes] = useState(-1);
  const [idCargo, setIdCargo] = useState(-1);
  const [idCongregacao, setIdCongregacao] = useState(-1);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const novaList = [];
      const response = await axios.get('/membro');
      response.data.map((dado) => {
        const data = new Date(dado.data_nascimento);
        const hoje = new Date();
        if (data.getMonth() === hoje.getMonth()) {
          novaList.push(dado);
        }
      });
      renderizaLista(novaList);
      const response2 = await axios.get('/cargo');
      setCargos(response2.data);
      const response3 = await axios.get('/setor');
      setSetors(response3.data);
      setIsLoading(false);
    }
    getData();
  }, []);
  const renderizaLista = (list) => {
    const novaLista = [];

    list.map((dado) => {
      const data = new Date(dado.data_nascimento);

      const dataFormatada = getDataDB(data);
      novaLista.push({
        id: dado.id,
        nome: dado.nome,
        dataAniversario: dataFormatada,
      });
    });
    setMembros(novaLista);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const novaLista = [];
    const response = await axios.get('/membro');
    // apenas o mes selecionado
    if (mes !== -1 && idCargo === -1 && idCongregacao === -1) {
      response.data.map((dado) => {
        let mesAniversario = new Date(dado.data_nascimento);
        mesAniversario = mesAniversario.getMonth();

        if (mes === mesAniversario) novaLista.push(dado);
      });
      renderizaLista(novaLista);
    }
    // apenas o mes e a congregacao selecionada
    if (mes !== -1 && idCargo !== -1 && idCongregacao === -1) {
      response.data.map((dado) => {
        let mesAniversario = new Date(dado.data_nascimento);
        mesAniversario = mesAniversario.getMonth();

        if (mes === mesAniversario && dado.cargo_id === idCargo)
          novaLista.push(dado);
      });
      renderizaLista(novaLista);
    }
    // todos selecionados
    if (mes !== -1 && idCargo !== -1 && idCongregacao !== -1) {
      response.data.map((dado) => {
        let mesAniversario = new Date(dado.data_nascimento);
        mesAniversario = mesAniversario.getMonth();

        if (
          mes === mesAniversario &&
          dado.cargo_id === idCargo &&
          dado.setor_id === idCongregacao
        )
          novaLista.push(dado);
      });
      renderizaLista(novaLista);
    }
    // apenas mes e congregacao selecionados
    if (mes !== -1 && idCargo === -1 && idCongregacao !== -1) {
      response.data.map((dado) => {
        let mesAniversario = new Date(dado.data_nascimento);
        mesAniversario = mesAniversario.getMonth();

        if (
          mes === mesAniversario &&
          dado.cargo_id === idCargo &&
          dado.setor_id === idCongregacao
        )
          novaLista.push(dado);
      });
      renderizaLista(novaLista);
    }
    setIdCargo(-1);
    setIdCongregacao(-1);
    setMes(-1);
    setIsLoading(false);
  };
  const handleIdCargo = async (e) => {
    const valor = Number(e.target.value);
    setIdCargo(valor);
  };
  const handleMes = (e) => {
    const valor = Number(e.target.value);
    setMes(valor);
  };
  const handleIdSetor = (e) => {
    const valor = Number(e.target.value);
    setIdCongregacao(valor);
  };
  return (
    <Container>
      <h1>Lista de Aniversariantes</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="congregacao">
              Selecione o mês
              <select onChange={handleMes} value={mes}>
                <option value="nada">Selecione o mês</option>
                {listMeses.map((dado) => (
                  <option key={dado.id} value={dado.id}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="cargo">
              Filtrar por cargo
              <select onChange={handleIdCargo}>
                <option value="nada">Selecione o cargo</option>
                {cargos.map((dado) => (
                  <option key={dado.id} value={dado.id}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="cargo">
              Filtrar por congregação
              <select onChange={handleIdSetor}>
                <option value="nada">Selecione a congregação</option>
                {setors.map((dado) => (
                  <option key={dado.id} value={dado.id}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
        </Row>
        <Row>
          <button style={{ marginTop: 10 }} type="submit">
            Filtrar <FaSearch />
          </button>
        </Row>
      </Form>
      <Listagem>
        <h3>Aniversariantes</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Data</th>
              </tr>
            </thead>
            <tbody>
              {membros.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.nome}</td>
                  <td>{dado.dataAniversario}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
    </Container>
  );
}
