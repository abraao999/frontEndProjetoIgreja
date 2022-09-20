/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { toast } from "react-toastify";
import { FaEdit, FaPrint, FaSearch, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { Col, Row, Form, Table, Button, Image } from "react-bootstrap";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Container } from "../../../styles/GlobalStyles";
import { Label, LabelSelect, Listagem } from "./styled";
import axios from "../../../services/axios";
import Modal from "../../../components/Modal";
import ComboBox from "../../../components/ComboBox";
import Loading from "../../../components/Loading";
import history from "../../../services/history";
// import * as actions from '../../store/modules/auth/actions';

import { Impressao } from "../../../printers/impLivrariaLivro";
import ModalMembro from "../../../components/ModalMembro";
import { getDataDB, imagenVazia } from "../../../util";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function Estoque({ match }) {
  const id = get(match, "params.id", "");
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState("");
  const [indiceDelecao, setIndiceDelecao] = useState("");

  const [nomeMembro, setNomeMembro] = useState("");
  const [idMembro, setIdMembro] = useState("");
  const [contato, setContato] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [status, setStatus] = useState("");
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [listPedidos, setListPedidos] = useState([]);
  const [livrosBusca, setLivrosBusca] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const dataStorage = useSelector((state) => state.auth);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get("/livrariaLivro");
      const response3 = await axios.get("/livrariaFotos");
      renderizaLista(response.data, response3.data);
      setIsLoading(false);
    }
    getData();
  }, [id]);
  const renderizaLista = (livro, foto) => {
    const novaLista = [];
    livro.map((l) => {
      const dataFormatada = getDataDB(new Date(l.data_entrada));

      let achou = false;
      foto.map((f) => {
        if (l.foto_id === f.id) {
          novaLista.push({ ...l, dataFormatada, urlPreview: f.url });
          achou = true;
        }
      });
      if (!achou)
        novaLista.push({ ...l, dataFormatada, urlPreview: imagenVazia });
    });
    setListPedidos(novaLista);
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idFuncao, index) => {
    setIdParaDelecao(idFuncao);
    setIndiceDelecao(index);
    setShowDelete(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/livrariaPedido/${idParaDelecao}`);
      const novaLista = [...listPedidos];
      novaLista.splice(indiceDelecao, 1);
      setListPedidos(novaLista);
      toast.success("Pedido excluído com sucesso");
      setShowDelete(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      const msg = get(error, "response.data.erros", 0);
      if (status === 401) {
        toast.error("Voce precisa fazer login");
      } else {
        msg.map((dado) => toast.error(dado));
      }
      setIsLoading(false);
    }
  };
  const visualizarImpressao = async () => {
    const classeImpressao = new Impressao(listPedidos);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open("", "_blank"));
  };
  const handlePesquisaNome = async () => {
    if (descricao.length > 0) {
      try {
        const novaLista = [];
        const response = await axios.get("/livrariaLivro");

        listPedidos.map((dados) => {
          if (
            String(dados.descricao)
              .toLowerCase()
              .includes(String(descricao.toLowerCase()))
          ) {
            novaLista.push(dados);
          }
        });
        setLivrosBusca(novaLista);
        setShow(true);
      } catch (e) {
        toast.error("Condigo não existe");
        console.log(e);
      }
    } else {
      axios.get("/livrariaLivro").then((response) => {
        setLivrosBusca(response.data);
        setShow(true);
      });
    }
  };
  const handleIdMembro = async (idm) => {
    let novaLista = [];
    try {
      await axios.get(`/livrariaLivro/${idm}`).then((response) => {
        setDescricao(response.data.descricao);
        novaLista = [response.data];
        renderizaLista(novaLista);
        handleClose();
      });
    } catch (e) {
      toast.error("Condigo não existe");
      console.log(e);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Modal
        title="Atenção!!!"
        handleClose={() => setShowDelete(false)}
        show={showDelete}
        text="Deseja exluir esse registro"
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleFunctionConfirm}
      />
      <ModalMembro
        title="Selecione o livro"
        handleClose={handleClose}
        show={show}
        list={livrosBusca}
        buttonCancel="Fechar"
        handleIdMembro={handleIdMembro}
      />
      <Form>
        <Listagem>
          <h3>Estoque</h3>
          <Button variant="success" onClick={visualizarImpressao} size="lg">
            <FaPrint size={30} />
          </Button>
        </Listagem>
        <Row>
          <Col sm={12} md={11} className="my-1">
            <Form.Label htmlFor="descricao">Descricao</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
              }}
              onBlur={(e) => {
                handlePesquisaNome();
              }}
              placeholder="Nome"
            />
          </Col>
          <Col
            sm={12}
            md={1}
            className="my-1"
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Button size="lg" onClick={handlePesquisaNome} variant="success">
              <FaSearch size={16} />
            </Button>
          </Col>
        </Row>
      </Form>

      <h3>Livros em Estoque</h3>

      <Table responsive striped bordered hover style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th scope="col">Prévia</th>
            <th scope="col">Descrição</th>
            <th scope="col">Quantidade</th>
            <th scope="col">Custo</th>
            <th scope="col">Valor</th>
            <th scope="col">Data Aquisição</th>
            <th scope="col">Alterar</th>
            <th scope="col">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {listPedidos.map((dado, index) => (
            <tr key={String(dado.id)}>
              <td>
                <Image
                  roundedCircle
                  src={dado.urlPreview}
                  style={{ height: "30px", width: "30px" }}
                />
              </td>
              <td>{dado.descricao}</td>
              <td>{dado.quantidade}</td>
              <td>{dado.custo}</td>
              <td>{dado.valor}</td>
              <td>{dado.dataFormatada}</td>

              <td>
                <Button
                  variant="warning"
                  onClick={() => history.push(`/cadLivro/${dado.id}/edit`)}
                >
                  <FaEdit size={16} />
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleShow(dado.id, index)}
                >
                  <FaTrash size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
Estoque.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
