import React, { useEffect, useState } from "react";

import { FaSearch } from "react-icons/fa";

import { useSelector } from "react-redux";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { Container } from "../../../styles/GlobalStyles";
import { Label, Listagem } from "./styled";
import axios from "../../../services/axios";
import moment from "moment";
import "moment/locale/pt-br";
import ComboBox from "../../../components/ComboBox";
import Loading from "../../../components/Loading";

export default function Sorteio() {
  const [classes, setClasses] = useState([]);
  const [listSetores, setListSetores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [hidden, setHidden] = useState(true);
  const [autorizado, setAutorizado] = useState(true);
  const [disebledClasse, setDisebledClasse] = useState(false);

  const [classeSeletected, setClasseSeletected] = useState(0);
  const [classeNome, setClasseNome] = useState("");
  const [ganhador, setGanhador] = useState("");
  const [congregacaoNome, setCongregacaoNome] = useState("");
  const [presenca, setPresenca] = useState([]);
  const [ano, setAno] = useState(0);
  const dataStorage = useSelector((state) => state.auth);

  useEffect(() => {
    async function getData() {
      if (
        dataStorage.user.function_id === 1 ||
        dataStorage.user.function_id === 5
      ) {
        setAutorizado(false);
        setDisebledClasse(true);
      }

      console.log(dataStorage.user);
      const response1 = await axios.get("/setor");
      setListSetores(response1.data);

      const response = await axios.get("/classe");
      const listaClasse = [];
      response.data.map((dado) => {
        if (dado.setor_id === dataStorage.user.setor_id) {
          listaClasse.push(dado);
        }
      });
      setClasses(listaClasse);
    }
    getData();
  }, []);

  const contadorPresenca = async (listPresenca, alunos) => {
    // contador de presenca
    const novaLista = [];
    console.log(listPresenca);
    alunos.map((aluno) => {
      let contador = 0;

      console.log(contador);
      listPresenca.map((dado) => {
        if (dado.aluno_id === aluno.id) {
          contador += 1;
        }
      });
      // 100 --- 13
      // x --- presenca
      // x = (presenca*100)/13
      // renderiza a lista com os dados
      const porcentagem = ((contador * 100) / 44).toFixed(2);

      if (porcentagem >= 50)
        novaLista.push({
          id: aluno.id,
          nomeAluno: aluno.nome,
          frequencia: contador,
          faltas: 0,
          porcentagem,
        });
    });
    setHidden(false);
    handleSorteio(novaLista);
    setPresenca(novaLista);
    console.log(novaLista);
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const alunos = [];

    axios.get("/aluno").then((response) => {
      response.data.map((aluno) => {
        if (aluno.classe_id === classeSeletected) alunos.push(aluno);
      });
    });

    setIsLoading(true);
    const novaList = [];

    axios.get(`/chamada`).then((dados) => {
      dados.data.map((dado) => {
        if (
          moment(dado.data_aula).year() === ano &&
          dado.id_classe === classeSeletected
        ) {
          novaList.push(dado);
        }
      });
      contadorPresenca(novaList, alunos);
    });
  };
  const handleAno = async (e) => {
    const valor = Number(e.target.value);

    setAno(valor);
  };
  const handleGetIdClasse = (e) => {
    const nome = e.target.value;
    setClasseNome(e.target.value);

    classes.map((dado) => {
      if (nome === dado.descricao) setClasseSeletected(dado.id);
    });
  };
  const handleGetIdCongregacao = async (e) => {
    const nome = e.target.value;
    setCongregacaoNome(e.target.value);
    setDisebledClasse(false);
    let idSetor = 0;
    const response = await axios.get("/classe");

    listSetores.map((dado) => {
      if (nome === dado.descricao) {
        setClasseSeletected(dado.id);
        idSetor = dado.id;
      }
    });

    const listaClasse = [];
    response.data.map((dado) => {
      if (dado.setor_id === idSetor) {
        listaClasse.push(dado);
      }
    });
    setClasses(listaClasse);
  };
  const handleSorteio = (lista) => {
    const valor = Math.floor(Math.random() * lista.length);

    setGanhador(lista[valor].nomeAluno);
  };
  return (
    <Container>
      <h1>Sorteio</h1>
      <Loading isLoading={isLoading} />
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={3}>
            <ComboBox
              title="Selecione a congregação"
              onChange={handleGetIdCongregacao}
              value={congregacaoNome}
              list={listSetores}
              hidden={autorizado}
            />
          </Col>
          <Col sm={12} md={3}>
            <Label htmlFor="congregacao">
              Selecione a classe
              <select
                onChange={handleGetIdClasse}
                value={classeNome}
                disabled={disebledClasse}
              >
                <option value="nada">Selecione a classe</option>
                {classes.map((dado) => (
                  <option key={dado.id} value={dado.descricao}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={3}>
            <Label htmlFor="trimestre">
              Filtrar por trimestre
              <select onChange={handleAno}>
                <option value="nada">Selecione o ano</option>

                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
              </select>
            </Label>
          </Col>
          <Col
            sm={12}
            md={2}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Button variant="success" type="submit">
              <FaSearch />
            </Button>
          </Col>
        </Row>
      </Form>
      <Listagem hidden={hidden}>
        <h3>Alunos com mais 50% de presença</h3>

        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Percentual de presença</th>
              {/* <th scope="col">Excluir</th> */}
            </tr>
          </thead>
          <tbody>
            {presenca.map((dado) => (
              <tr key={String(dado.id)}>
                <td>{dado.nomeAluno}</td>
                <td>{dado.porcentagem}</td>

                {/* <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/relatorioPresencaEbd"
                    >
                      <FaWindowClose size={16} />
                    </Link>
                  </td> */}
              </tr>
            ))}
          </tbody>
        </Table>

        <h3>Ganhador:</h3>
        <h3>{ganhador}</h3>
      </Listagem>
    </Container>
  );
}
