/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import {
  FaEdit,
  FaWindowClose,
  FaSearch,
  FaCheck,
  FaCcJcb,
} from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { AiFillPrinter } from 'react-icons/ai';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Container } from '../../../styles/GlobalStyles';
import { Header, Label, Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
import ModalMembro from '../../../components/ModalMembro';
import { getDataBanco, getToday, listMeses } from '../../../util';

import { Impressao } from '../../../printers/impRelatorioDizimoIndividual';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function RelatorioDizimoDiario() {
  const [show, setShow] = useState(false);
  const [showMembro, setShowMembro] = useState(false);

  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [idMembro, setIdMembro] = useState('');
  const [nomeMembro, setNomeMembro] = useState('');

  const [membros, setMembros] = useState([]);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [ano, setAno] = useState('2021');

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      const novaList = [];
      axios.get('/dizimo').then(async (dado) => {
        dado.data.map((valor) => {
          const dataOperacao = new Date(valor.created_at);
          if (getDataBanco(dataOperacao) === getToday()) {
            novaList.push(valor);
          }
        });
        setListMovimentacao(novaList);
      });
      setIsLoading(false);
    }
    getData();
  }, []);

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h2>Dizimistas do dia</h2>

      <Listagem>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Nome</th>
              </tr>
            </thead>
            <tbody>
              {listMovimentacao.map((dado) => (
                <tr key={String(dado.id)}>
                  <td>{dado.nome}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
    </Container>
  );
}
