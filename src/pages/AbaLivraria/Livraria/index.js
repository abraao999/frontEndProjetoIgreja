import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { Container } from "../../../styles/GlobalStyles";

import Loading from "../../../components/Loading";

import { ContainerBox } from "./styled";

export default function Livraria() {
  const [isLoading, setIsLoading] = useState(false);
  const storage = useSelector((state) => state.auth);
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      console.log(storage.user);
      setIsLoading(false);
    }
    getData();
  }, []);

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <h1>Livraria</h1>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/painelLivrariaCamisetas">
              <ContainerBox>
                <FaBook size={50} />
                <span>Camiseta</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/painelLivrariaLivros">
              <ContainerBox>
                <FaBook size={50} />
                <span>Livros</span>
              </ContainerBox>
            </Link>
          </Col>
          <Col sm={6} md={4} className="my-1">
            <Link to="/painelLivrariaRevistas">
              <ContainerBox>
                <FaBook size={50} />
                <span>Revistas</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={4} className="my-1">
            <Link to="/">
              <ContainerBox>
                <MdArrowBack size={50} />
                <span>Painel Principal</span>
              </ContainerBox>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
