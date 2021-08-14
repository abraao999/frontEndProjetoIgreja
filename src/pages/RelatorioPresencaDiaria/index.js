/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';

import { useSelector } from 'react-redux';
import { Container } from '../../styles/GlobalStyles';
import { Form, Table, Listagem } from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';

export default function RelatorioPresencaDiaria({ match }) {
  const [dataAula, setDataAula] = useState('');

  const [presencaTotal, setPresencaTotal] = useState([]);
  const [classes, setClasses] = useState([]);
  const [listAlunos, setListAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const dataStorage = useSelector((state) => state.auth);
  const [presenca, setPresenca] = useState([]);

  useEffect(() => {
    async function getData() {
      const alunos = await axios.get('/aluno');
      setListAlunos(alunos.data);
      const response = await axios.get('/classe');
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

  const renderizaLista = (list, mes) => {
    const novaLista = [];
    list.map((dado) => {
      const data = new Date(dado.data_aula);
      const dataFormatada = `${data.getDate()}/
      ${data.getMonth() + 1}/${data.getFullYear()}`;
      novaLista.push({
        id: dado.id,
        nomeAluno: dado.desc_aluno,
        classeId: dado.id_classe,
        classeDesc: dado.desc_classes,
        dataAula: dataFormatada,
      });
    });
    setHidden(false);
    contadorPresenca(novaLista);
    setPresencaTotal(list.length);
  };

  const contadorPresenca = async (listaPresenca) => {
    // contador de presenca
    const novaLista = [];
    classes.map((classe) => {
      let alunosPresente = 0;
      let qtdeAlunos = 0;

      listAlunos.map((aluno) => {
        if (aluno.classe_id === classe.id) {
          qtdeAlunos += 1;
        }
      });

      listaPresenca.map((dado) => {
        if (dado.classeId === classe.id) {
          alunosPresente += 1;
        }
      });

      // renderiza a lista com os dados
      novaLista.push({
        idClasse: classe.id,
        nomeClasse: classe.descricao,
        alunosPresente,
        qtdeAlunos,
        faltas: qtdeAlunos - alunosPresente,
      });
    });
    setPresenca(novaLista);
    setIsLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const novaList = [];

    if (dataAula) {
      axios.get(`/chamada`).then((dados) => {
        dados.data.map((dado) => {
          let dataSelect = new Date(dataAula);
          let dataBD = new Date(dado.data_aula);

          dataSelect = `${dataSelect.getDate() + 1}-${dataSelect.getMonth() + 1
            }-${dataSelect.getFullYear()}`;

          dataBD = `${dataBD.getDate()}-${dataBD.getMonth() + 1
            }-${dataBD.getFullYear()}`;

          if (dataSelect === dataBD) {
            novaList.push(dado);
          }
        });
        renderizaLista(novaList);
      });
    } else {
      toast.error('Selecione todos os campos para filtrar');
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <h1>Relatório de presença diária </h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dataAula">
            Data da aula
            <input
              type="date"
              value={dataAula}
              onChange={(e) => {
                setDataAula(e.target.value);
              }}
            />
          </label>
        </div>

        <button type="submit">
          Filtrar <FaSearch />
        </button>
      </Form>
      <Listagem hidden={hidden}>
        <h3>Relatório de Presença</h3>
        <center>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Nome da Classe</th>
                <th scope="col">Total de aluno</th>
                <th scope="col">Total de presenca</th>
                <th scope="col">Total de faltas</th>
                {/* <th scope="col">Excluir</th> */}
              </tr>
            </thead>
            <tbody>
              {presenca.map((dado) => (
                <tr key={String(dado.idClasse)}>
                  <td>{dado.nomeClasse}</td>
                  <td>{dado.qtdeAlunos}</td>
                  <td>{dado.alunosPresente}</td>
                  <td>{dado.faltas}</td>

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
        </center>
        <h3>Presença Total: {presencaTotal}</h3>
      </Listagem>
    </Container>
  );
}
RelatorioPresencaDiaria.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
