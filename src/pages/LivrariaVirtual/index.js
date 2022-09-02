/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Container } from "../../styles/GlobalStyles";
import axios from "../../services/axios";
import Loading from "../../components/Loading";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Preview } from "./styled";
import history from "../../services/history";
import ModalReservaLivro from "../../components/ModalReservaLivro";
import { toast } from "react-toastify";
// import { Container } from './styles';
function LivrariaVirtual() {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [listLivros, setListLivros] = useState([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const [descricao, setDescricao] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [livroId, setLivroId] = useState("");
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get("/livrariaLivro");
      setListLivros(response.data);
      setIsLoading(false);
    }
    getData();
  }, []);
  const sendEmail = async () => {
    setIsLoading(true);
    let bodyHtml = "";

    const response = await axios.post("/livrariaReserva", {
      nome_cliente: nomeCliente,
      livro_id: livroId,
      celular,
      status: "PENDENTE",
      data_reserva: new Date(),
    });

    bodyHtml += `
         <div>
         <p><strong>Nº Reserva: </strong><span>${response.data.id}</span></p>
         <p><strong>Nome Cliente: </strong><span>${nomeCliente}</span></p>
         <p><strong>Nome do Livro: </strong><span>${descricao}</span></p>
         <p><strong>Telefone: </strong><span>${celular}</span></p>
         <p><strong>E-mail: </strong><span>${email}</span></p>
         </div>`;
    try {
      const response = await axios.post("/sendEmail", {
        bodyHtml,
        email,
      });
      toast.success("Pedido de orçamento enviado com sucesso");
    } catch (error) {
      toast.error("Desculpe mas não foi possível enviar sua solicitaçãos");
    }
    setShow(false);
    setIsLoading(false);
  };

  return (
    <Container>
      <ModalReservaLivro
        show={show}
        nomeCliente={nomeCliente}
        onChangeNomeCliente={(e) => setNomeCliente(e.target.value)}
        onChangeEmail={(e) => setEmail(e.target.value)}
        onChangeCelular={(e) => setCelular(e.target.value)}
        handleClose={() => setShow(false)}
        handleFunctionConfirm={() => sendEmail()}
      />
      <Loading isLoading={isLoading} />
      <h1>Livraria Virtual</h1>
      <Row xs={1} sm={1} md={3} className="g-4">
        {listLivros.map((dado) => (
          <Col key={dado.id}>
            <Card style={{ height: "20rem" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Preview src={dado.url} />
              </div>
              <Card.Body
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  paddingTop: "0.1rem",
                }}
              >
                <p style={{ fontSize: "1rem", margin: 0 }}>{dado.descricao}</p>
                {parseInt(dado.quantidade) === 0 ? (
                  <>
                    <strong style={{ color: "gray", fontSize: "1rem" }}>
                      INDISPONIVEL
                    </strong>
                    <Button
                      onClick={() => {
                        history.push(
                          `/pedidoLivro/${dado.descricao}/nomeLivro`
                        );
                      }}
                      variant="danger"
                    >
                      Fazer Pedido
                    </Button>
                  </>
                ) : (
                  <>
                    <strong style={{ color: "red", fontSize: "1rem" }}>
                      R$ {parseFloat(dado.valor).toFixed(2)}
                    </strong>
                    <Button
                      onClick={() => {
                        setShow(true);
                        setDescricao(dado.descricao);
                        setLivroId(dado.id);
                      }}
                      variant="success"
                    >
                      Reservar
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default LivrariaVirtual;
