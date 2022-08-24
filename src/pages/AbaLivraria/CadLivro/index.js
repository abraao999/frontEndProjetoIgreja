/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { toast } from "react-toastify";
import { FaEdit, FaSave, FaWindowClose } from "react-icons/fa";
import { get, uniqueId } from "lodash";
import { Button, Col, Form, Image, Row, Table } from "react-bootstrap";
import { Container } from "../../../styles/GlobalStyles";
import Modal from "../../../components/Modal";

import { DropContainer, UploadMessage, Listagem } from "./styled";
import axios from "../../../services/axios";

import Loading from "../../../components/Loading";
import history from "../../../services/history";
import ComboBox from "../../../components/ComboBox";
import { imagenVazia, porcetagem } from "../../../util";
import Dropzone from "react-dropzone";
import FileList from "../../../components/FileList";
import fileSize from "filesize";
// import * as actions from '../../store/modules/auth/actions';

export default function CadLivro({ match }) {
  const id = get(match, "params.id", "");
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState("");
  const [indiceDelecao, setIndiceDelecao] = useState("");

  const [descricao, setDescricao] = useState("");
  const [dataEntrada, setDataEntrada] = useState("");
  const [valor, setValor] = useState("");
  const [custo, setCusto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [urlFoto, setUrlFoto] = useState("");
  const [fotoId, setFotoId] = useState("");
  const [autor, setAutor] = useState("");
  const [porcentagem, setPorcentagem] = useState(0);
  const [listLivro, setListLivro] = useState([]);
  const [listFotos, setListFotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get("/livrariaLivro");
      if (id) {
        const response2 = await axios.get(`/livrariaLivro/${id}`);
        setDescricao(response2.data.descricao);
        setCusto(response2.data.custo);
        setValor(response2.data.valor);
        setQuantidade(response2.data.quantidade);
        setDataEntrada(response2.data.data_entrada);
        setFotoId(response2.data.foto_id);
        setUrlFoto(response2.data.url);
        setAutor(response2.data.autor);
      }
      const response3 = await axios.get("/livrariaFotos");
      setListFotos(response3.data);
      renderizaLista(response.data, response3.data);

      setIsLoading(false);
    }
    getData();
  }, [id]);

  const renderizaLista = (livro, foto) => {
    const novaLista = [];
    livro.map((l) => {
      let achou = false;
      foto.map((f) => {
        if (l.foto_id === f.id) {
          novaLista.push({ ...l, urlPreview: f.url });
          achou = true;
        }
      });
      if (!achou) novaLista.push({ ...l, urlPreview: imagenVazia });
    });
    setListLivro(novaLista);
  };
  const limpaCampos = () => {
    setDescricao("");
    setValor("");
    setCusto("");
    setQuantidade("");
    setDataEntrada("");
    setUploadedFiles([]);
    setUrlFoto("");
    setFotoId("");
    setAutor("");
  };
  const handleRemoveIten = () => {
    setUploadedFiles([]);
  };
  const salvaBanco = async (resposta) => {
    let formErrors = false;
    if (
      descricao.length < 3 ||
      descricao.length > 255 ||
      parseFloat(valor) <= 0 ||
      parseFloat(custo) <= 0 ||
      parseInt(quantidade) <= 0
    ) {
      formErrors = true;
      toast.error("Campo descricao deve ter entre 3 e 255 caracteres");
    }
    if (formErrors) return;
    setIsLoading(true);
    try {
      if (!id) {
        const response = await axios.post("/livrariaLivro", {
          descricao,
          data_entrada: dataEntrada,
          custo,
          valor,
          autor,
          foto_id: resposta.id || 19,
          quantidade,
        });
        console.log(response);
        const novaLista = await axios.get("/livrariaLivro");
        setListLivro(novaLista.data);
        limpaCampos();
        toast.success("livro criado com sucesso");

        setIsLoading(false);
      } else {
        if (uploadedFiles.length > 0) {
          const response = await axios.put(`/livrariaLivro/${id}`, {
            descricao,
            data_entrada: dataEntrada,
            custo,
            valor,
            autor,
            foto_id: resposta.id,
            quantidade,
          });
        } else {
          const response = await axios.put(`/livrariaLivro/${id}`, {
            descricao,
            data_entrada: dataEntrada,
            custo,
            valor,
            autor,
            quantidade,
          });
        }
        const novaLista = await axios.get("/livrariaLivro");
        setListLivro(novaLista.data);
        limpaCampos();
        history.push("/cadLivro");
        toast.success("livro editado com sucesso");

        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      if (status === 401) {
        toast.error("Voce precisa fazer login");
      } else {
        toast.error("Erro ao alterar o livro");
      }
      setIsLoading(false);
    }
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    console.log(uploadedFiles);
    if (uploadedFiles.length > 0)
      processUpload(uploadedFiles[0]).then((resposta) => salvaBanco(resposta));
    else salvaBanco();
  }
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idLivro, index) => {
    setIdParaDelecao(idLivro);
    setIndiceDelecao(index);
    setShow(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/livrariaLivro/${idParaDelecao}`);
      const novaLista = [...listLivro];
      novaLista.splice(indiceDelecao, 1);
      setListLivro(novaLista);
      toast.success("Livro excluído com sucesso");
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, "response.data.status", 0);
      if (status === 401) {
        toast.error("Voce precisa fazer loggin");
      } else {
        toast.error("Erro ao excluir a o livro");
      }
      setIsLoading(false);
    }
  };
  const calculaValor = (p) => {
    let aux = parseFloat(custo);
    aux = aux + (aux * p) / 100;
    setValor(aux.toFixed(2));
  };
  const renderDragMessage = (isDragActive, isDragReject) => {
    if (!isDragActive)
      return <UploadMessage>Click aqui ou arraste arquivos ...</UploadMessage>;
    if (isDragReject)
      return (
        <UploadMessage type="error">Arquivo não suportado ...</UploadMessage>
      );
    return (
      <UploadMessage type="success">Solte os aquivos aqui ...</UploadMessage>
    );
  };
  const handleUpload = (files) => {
    // console.log(files);
    if (uploadedFiles.length < 1) {
      const listaAtual = [...uploadedFiles];
      const aux = files.map((file) => ({
        file,
        id: uniqueId(),
        name: file.name,
        readableSize: fileSize(file.size),
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
        error: false,
        url: null,
      }));
      setUploadedFiles(listaAtual.concat(aux));
      setUrlFoto(aux[0].preview);
      const aux1 = listaAtual.concat(aux);
    }
    // aux1.map((dado) => processUpload(dado));
  };
  const processUpload = async (dado) => {
    const data = new FormData();
    data.append("file", dado.file, dado.name);
    console.log(dado);
    const res = await axios.post("/livrariaFotos", data, {
      onUploadProgress: (e) => {
        // const progress = parseInt(Math.round((e.loaded * 100) / e.total));
        // updateFile(dado.id, { ...dado, progress });
      },
    });
    console.log(res.data);
    setFotoId(res.data.id);
    setUrlFoto(res.data.url);
    return res.data;
  };
  const updateFile = (id, data) => {
    console.log(data);
    const listaAtual = [];

    if (uploadedFiles.length > 0) {
      console.log(uploadedFiles.length);
      uploadedFiles.map((dado, index) => {
        if (id === dado.id) {
          listaAtual.push({ ...dado, ...data });
          console.log("if");
        } else {
          listaAtual.push(dado);
          console.log("else");
        }
      });
      console.log(listaAtual);
    } else {
      console.log(listaAtual);
      listaAtual.push(data);
    }
    setUploadedFiles(listaAtual);
  };
  return (
    <Container>
      <h1 id="top">{id ? "Editar Livro" : "Novo Livro"}</h1>
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
      <Row>
        <Col
          sm={12}
          md={6}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Dropzone accept="image/*" onDropAccepted={handleUpload}>
            {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
              <DropContainer
                {...getRootProps()}
                isDragActive={isDragActive}
                isDragReject={isDragReject}
              >
                <input {...getInputProps()} />
                {renderDragMessage(isDragActive, isDragReject)}
              </DropContainer>
            )}
          </Dropzone>
          {!!uploadedFiles.length && (
            <FileList
              files={uploadedFiles}
              handleRemoveIten={handleRemoveIten}
            />
          )}
        </Col>
        {urlFoto && (
          <Col sm={12} md={6}>
            <div
              style={{
                height: "100%",
                maxHeight: "10rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Image src={urlFoto} style={{ maxHeight: "10rem" }} />
            </div>
          </Col>
        )}
      </Row>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={12} className="my-1">
            <Form.Label htmlFor="descricao">Descrição:</Form.Label>

            <Form.Control
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value.toLocaleUpperCase())}
              placeholder="Descrição"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={9} className="my-1">
            <Form.Label htmlFor="descricao">Nome Autor:</Form.Label>

            <Form.Control
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value.toLocaleUpperCase())}
              placeholder="Nome Autor"
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Data da Aquisição:</Form.Label>

            <Form.Control
              type="date"
              value={dataEntrada}
              onChange={(e) => setDataEntrada(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Custo:</Form.Label>

            <Form.Control
              type="number"
              value={custo}
              onChange={(e) => setCusto(e.target.value)}
              placeholder="Custo"
            />
          </Col>
          <Col sm={12} md={2}>
            <ComboBox
              list={porcetagem}
              title="Porcentagem"
              onChange={(e) => {
                calculaValor(parseInt(e.target.value));
                setPorcentagem(e.target.value);
              }}
              value={porcentagem}
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Valor:</Form.Label>

            <Form.Control
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Valor"
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="descricao">Quantidade:</Form.Label>

            <Form.Control
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Quantidade"
            />
          </Col>
          <Col
            sm={12}
            md={1}
            className="my-1"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-start",
            }}
          >
            <Button type="submit" variant="success">
              <FaSave size={24} style={{ marginLeft: 3 }} />
            </Button>
          </Col>
        </Row>
      </Form>

      <Listagem>
        <h3>Lista de Livros</h3>
        <center>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th scope="col">Prévia</th>
                <th scope="col">Descrição</th>
                <th scope="col">Custo</th>
                <th scope="col">Valor</th>
                <th scope="col">Quantidade em Estoque</th>
                <th scope="col">Alterar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {listLivro.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>
                    <Image
                      roundedCircle
                      src={dado.urlPreview}
                      style={{ height: "30px", width: "30px" }}
                    />
                  </td>
                  <td>{dado.descricao}</td>
                  <td>R${dado.custo}</td>
                  <td>R${dado.valor}</td>
                  <td>{dado.quantidade}</td>
                  <td>
                    <a href="#top">
                      <Button
                        variant="warning"
                        onClick={() => {
                          history.push(`/cadLivro/${dado.id}/edit/`);
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                      >
                        <FaEdit size={16} />
                      </Button>
                    </a>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleShow(dado.id, index)}
                      to={`/cadLivro/${dado.id}/delete`}
                    >
                      <FaWindowClose size={16} />
                    </Button>
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
CadLivro.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
