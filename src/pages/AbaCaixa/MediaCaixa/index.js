/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';

import { Col, Form, Row, Table } from 'react-bootstrap';
import pdfMake from 'pdfmake/build/pdfmake';
import { AiFillPrinter } from 'react-icons/ai';
import { Container } from '../../../styles/GlobalStyles';
import { Header, Label, Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
// import * as actions from '../../store/modules/auth/actions';
import { Impressao } from '../../../printers/impMediaValores';

export default function MediaCaixa() {
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      const listSetores = [];
      const response = await axios.get('/setor');
      response.data.map((dado) => {
        listSetores.push({
          id: dado.id,
          descricao: dado.descricao,
          entrada: 0,
          saida: 0,
          contEntrada: 0,
          contSaida: 0,
        });
      });

      axios.get('/caixa').then(async (dado) => {
        dado.data.map((caixa) => {
          listSetores.map((setores, indice) => {
            if (setores.id === caixa.setor_id) {
              const {
                id,
                descricao,
                entrada,
                saida,
                contEntrada,
                contSaida,
              } = listSetores[indice];

              if (caixa.tipo) {
                listSetores[indice] = {
                  id,
                  descricao,
                  entrada: entrada + caixa.valor,
                  saida,
                  contEntrada: contEntrada + 1,
                  contSaida,
                };
              } else {
                listSetores[indice] = {
                  id,
                  descricao,
                  entrada,
                  saida: saida + caixa.valor,
                  contEntrada,
                  contSaida: contSaida + 1,
                };
              }
            }
          });
        });
        calculaMedia(listSetores);
      });
      setIsLoading(false);
    }
    getData();
  }, []);

  const calculaMedia = (list) => {
    const aux = [];
    list.map((valor) => {
      const { descricao, entrada, saida, contEntrada, contSaida } = valor;
      aux.push({
        descricao,
        entrada: contEntrada !== 0 ? entrada / contEntrada : 0,
        saida: contSaida !== 0 ? saida / contSaida : 0,
      });
    });
    setListMovimentacao(aux);
  };
  const visualizarImpressao = async () => {
    const novaLista = [];
    listMovimentacao.map((dado) => {
      const { descricao, entrada, saida } = dado;

      novaLista.push({
        descricao,
        entrada,
        saida,
      });
    });
    const classeImpressao = new Impressao(novaLista);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
  };
  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Header>
        <h2>Relatório de caixa</h2>
        <button type="button" onClick={visualizarImpressao}>
          <AiFillPrinter size={35} />
        </button>
      </Header>
      <Listagem>
        <h3>Média de gastos</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Congregação</th>
                <th scope="col">Entrada</th>
                <th scope="col">Saida</th>
              </tr>
            </thead>
            <tbody>
              {listMovimentacao.map((dado, index) => (
                <tr key={String(index)}>
                  <td>{dado.descricao}</td>
                  <td>{dado.entrada}</td>
                  <td>{dado.saida}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
    </Container>
  );
}
