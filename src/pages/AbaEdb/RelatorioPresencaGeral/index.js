import React, { useEffect, useState } from "react";

import { FaSearch } from "react-icons/fa";

import { useSelector } from "react-redux";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { Container } from "../../../styles/GlobalStyles";
import { Label, Listagem } from "./styled";
import axios from "../../../services/axios";

import ComboBox from "../../../components/ComboBox";
import Loading from "../../../components/Loading";
import {
  fimPrimeiroTrimestre,
  fimQuartoTrimestre,
  fimSegundoTrimestre,
  fimTerceiroTrimestre,
  inicioPrimeiroTrimestre,
  inicioQuartoTrimestre,
  inicioSegundoTrimestre,
  inicioTerceiroTrimestre,
  trimestres,
} from "../../../util";
import Chart from "react-google-charts";

export default function RelatorioPresencaGeral() {
  const [classes, setClasses] = useState([]);
  const [listSetores, setListSetores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [hidden, setHidden] = useState(true);
  const [autorizado, setAutorizado] = useState(true);
  const [disebledClasse, setDisebledClasse] = useState(false);

  const [classeSeletected, setClasseSeletected] = useState(0);
  const [classeNome, setClasseNome] = useState("");
  const [congregacaoNome, setCongregacaoNome] = useState("");
  const [presenca, setPresenca] = useState([]);

  const dataStorage = useSelector((state) => state.auth);
  const options = {
    title: "Presença",
    is3D: true,
  };
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [idTrimestre, setIdTrimestre] = useState("");
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

    let totalPresenca = 0;

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
      totalPresenca += parseFloat(((contador * 100) / 13).toFixed(2));
      novaLista.push({
        id: aluno.id,
        nomeAluno: aluno.nome,
        frequencia: contador,
        faltas: 13 - contador,
        porcentagem: ((contador * 100) / 13).toFixed(2),
      });
    });
    setHidden(false);
    setPresenca(novaLista);
    console.log(novaLista);
    setIsLoading(false);

    const porcentagemPresenca = totalPresenca / alunos.length;
    const porcentagemFalta = 100 - porcentagemPresenca;
    handleGeraGraficoIndividual(porcentagemPresenca, porcentagemFalta);
  };
  const handleGeraGraficoIndividual = (
    porcentagemPresenca,
    porcentagemFalta
  ) => {
    setDadosGrafico([
      ["cabeçário", "nada"],
      ["Presença", porcentagemPresenca],
      ["Falta", porcentagemFalta],
    ]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const alunos = [];

    axios.get("/aluno").then((response) => {
      response.data.map((aluno) => {
        if (aluno.classe_id === classeSeletected) alunos.push(aluno);
      });
    });

    let dataInicial;
    let dataFinal;
    setIsLoading(true);
    const novaList = [];

    switch (idTrimestre) {
      case 0: {
        dataInicial = inicioPrimeiroTrimestre;
        dataFinal = fimPrimeiroTrimestre;

        break;
      }
      case 1: {
        dataInicial = inicioSegundoTrimestre;
        dataFinal = fimSegundoTrimestre;

        break;
      }
      case 2: {
        dataInicial = inicioTerceiroTrimestre;
        dataFinal = fimTerceiroTrimestre;

        break;
      }
      case 3: {
        dataInicial = inicioQuartoTrimestre;
        dataFinal = fimQuartoTrimestre;

        break;
      }

      default:
        break;
    }
    axios.get(`/chamada`).then((dados) => {
      dados.data.map((dado) => {
        if (
          dado.data_aula >= dataInicial &&
          dado.data_aula <= dataFinal &&
          dado.id_classe === classeSeletected
        ) {
          novaList.push(dado);
        }
      });
      contadorPresenca(novaList, alunos);
    });
  };
  const handleIdTrimestre = async (e) => {
    const valor = Number(e.target.value);

    setIdTrimestre(valor);
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
  return (
    <Container>
      <h1>Relatório de presença geral </h1>
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
              <select onChange={handleIdTrimestre}>
                <option value="nada">Selecione a trimestre</option>
                {trimestres.map((dado) => (
                  <option key={dado.id} value={dado.id}>
                    {dado.descricao}
                  </option>
                ))}
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
        <h3>Relatório de Presença</h3>

        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th scope="col">Nome da Classe</th>
              <th scope="col">Total de presença</th>
              <th scope="col">Total de faltas</th>
              <th scope="col">Percentual de presença</th>
              {/* <th scope="col">Excluir</th> */}
            </tr>
          </thead>
          <tbody>
            {presenca.map((dado) => (
              <tr key={String(dado.id)}>
                <td>{dado.nomeAluno}</td>
                <td>{dado.frequencia}</td>
                <td>{dado.faltas}</td>
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

        <Chart
          chartType="PieChart"
          data={dadosGrafico}
          options={options}
          width={"100%"}
          height={"400px"}
        />
      </Listagem>
    </Container>
  );
}
