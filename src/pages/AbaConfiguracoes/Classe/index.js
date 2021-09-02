import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Row, Form, Table } from 'react-bootstrap';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Container } from '../../../styles/GlobalStyles';
import { Listagem } from './styled';
import axios from '../../../services/axios';
import Modal from '../../../components/Modal';
import Loading from '../../../components/Loading';
import history from '../../../services/history';
// import * as actions from '../../store/modules/auth/actions';

import { Impressao } from '../../../printers/impressao';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function Classe({ match }) {
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [descricao, setDescricao] = useState('');
  const [descricaoList, setDescricaoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dataStorage = useSelector((state) => state.auth);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const lista = [];

      axios.get('/classe').then((response) => {
        response.data.map((valor) => {
          if (dataStorage.user.setor_id === valor.setor_id) {
            lista.push(valor);
          }
        });

        setDescricaoList(lista);
      });
      setIsLoading(false);
    }
    getData();
  }, [id]);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formErrors = false;

    if (descricao.length < 3 || descricao.length > 255) {
      formErrors = true;
      toast.error('Campo descricao deve ter entre 3 e 255 caracteres');
    }
    if (formErrors) return;
    try {
      if (!id) {
        const response = await axios.post('/classe', {
          descricao,
          setor_id: dataStorage.user.setor_id,
        });
        const novaLista = await axios.get('/classe');
        setDescricaoList(novaLista.data);
        setDescricao('');
        toast.success('Classe criada com sucesso');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/classe/${id}`, { descricao });
        const novaLista = await axios.get('/classe');
        setDescricaoList(novaLista.data);
        setDescricao('');
        toast.success('Classe editada com sucesso');

        history.push('/classe');
        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir uma Classe');
      }
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idFuncao, index) => {
    setIdParaDelecao(idFuncao);
    setIndiceDelecao(index);
    setShow(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/classe/${idParaDelecao}`);
      const novosFuncoes = [...descricaoList];
      novosFuncoes.splice(indiceDelecao, 1);
      setDescricaoList(novosFuncoes);
      toast.success('Classe excluida com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir a classe');
      }
      setIsLoading(false);
    }
  };
  const visualizarImpressao = async () => {
    const classeImpressao = new Impressao(descricaoList);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
  };

  return (
    <Container>
      <h1>{id ? 'Editar Classe' : 'Novo Classe'}</h1>
      <Loading isLoading={isLoading} />
      <Modal
        title="Atenção!!!"
        handleClose={handleClose}
        show={show}
        text="Deseja exluir esse registro"
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleFunctionConfirm}
      />
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={12} className="my-1">
            <Form.Label htmlFor="descricao">Nome da Classe:</Form.Label>

            <Form.Control
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Classe"
            />
          </Col>
        </Row>
        <Row>
          <button type="submit">Salvar</button>
        </Row>
      </Form>
      <Listagem>
        <h3>Lista de Classes</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Descição</th>
                <th scope="col">Alterar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {descricaoList.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.descricao}</td>
                  <td>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.descricao);
                        history.push(`/classe/${dado.id}/edit`);
                      }}
                      to={`/classe/${dado.id}/edit`}
                    >
                      <FaEdit size={16} />
                    </Link>
                  </td>
                  <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to={`/classe/${dado.id}/delete`}
                    >
                      <FaWindowClose size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
    </Container>
  );
}
Classe.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
