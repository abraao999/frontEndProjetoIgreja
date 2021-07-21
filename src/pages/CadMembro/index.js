/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import InputMask from 'react-input-mask';
import { isDate } from 'validator';
import { get } from 'lodash';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import { Container } from '../../styles/GlobalStyles';
import { Label } from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import history from '../../services/history';
import ComboBox from '../../components/ComboBox';
// import * as actions from '../../store/modules/auth/actions';
export default function CadMembro({ match }) {
  const id = get(match, 'params.id', '');

  const [maxId, setMaxId] = useState(0);
  const [setores, setSetores] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [cargos, setCargos] = useState([]);

  const [validated, setValidated] = useState(false);

  const [nomeMembro, setNomeMembro] = useState('');
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [dataBatismo, setDataBatismo] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [estacoCivil, setEstacoCivil] = useState('');
  const [profissao, setProfissao] = useState('');
  const [email, setEmail] = useState('');
  const [observacao, setObservacao] = useState('');
  const [password, setPassword] = useState('');
  const [cargo, setCargo] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [cep, setCep] = useState('');
  const [nomeConjuge, setNomeConjuge] = useState('');
  const [cargoId, setCargoId] = useState(0);
  const [functionNome, setFunctionNome] = useState('');
  const [functionId, setFunctionId] = useState(0);
  const [setor, setSetor] = useState('');
  const [setorId, setSetorId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [casado, setCasado] = useState(true);
  const [batizado, setBatizado] = useState(false);
  const [checado, setChecado] = useState(true);

  const listEstadoCivil = [
    { id: 1, descricao: 'Solteiro(a)' },
    { id: 2, descricao: 'Casado(a)' },
    { id: 3, descricao: 'Viúvo(a)' },
    { id: 4, descricao: 'Divorciado(a)' },
  ];
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      if (!id) {
        const dado = await axios.get('/membro/maxId');
        setMaxId(dado.data + 1);
      } else {
        const response = await axios.get(`/membro/${id}`);
        setNomeMembro(response.data.nome);
        setRg(response.data.rg);
        setCpf(response.data.cpf);
        setTelefone(response.data.telefone);
        setTelefone2(response.data.telefone2);
        setEstacoCivil(response.data.estado_civil);
        setProfissao(response.data.profissao);
        setObservacao(response.data.observacao);
        setRua(response.data.rua);
        setNumero(response.data.numero);
        setComplemento(response.data.complemento);
        setBairro(response.data.bairro);
        setCidade(response.data.cidade);
        setCep(response.data.cep);
        setNomeConjuge(response.data.nomeConjuge);
        setCargoId(response.data.cargo_id);
        setFunctionId(response.data.function_id);
        setSetorId(response.data.setor_id);
      }
      const response4 = await axios.get('/funcao');
      setFuncoes(response4.data);
      const response2 = await axios.get('/setor');
      setSetores(response2.data);
      const response3 = await axios.get('/cargo');
      setCargos(response3.data);
      setIsLoading(false);
    }
    getData();
  }, [id]);
  const limpaCampos = () => {
    setNomeMembro('');
    setRg('');
    setCpf('');
    setDataBatismo('');
    setDataNascimento('');
    setTelefone('');
    setEstacoCivil('');
    setProfissao('');
    setObservacao('');
    setSetor('Selecione a Congregação');
    setFunctionNome('Selecione a função');
    setCargo('Selecione o cargo');
    setFunctionId(0);
    setSetorId(0);
    setCargoId(0);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      // e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);

    setIsLoading(true);
    let formErrors = false;

    if (
      nomeMembro.length < 3 ||
      rg.length < 3 ||
      cpf.length < 11 ||
      telefone.length < 11 ||
      estacoCivil.length < 3 ||
      profissao.length < 3 ||
      setorId === 0 ||
      functionId === 0 ||
      cargoId === 0
    ) {
      formErrors = true;
      setIsLoading(false);
      toast.error('Preencha todos os campos');
    }
    if (formErrors) return;
    try {
      if (!id) {
        const response = await axios.post(`membro`, {
          nome: nomeMembro,
          rg,
          cpf,
          data_batismo: dataBatismo || null,
          data_nascimento: dataNascimento || null,
          profissao,
          estado_civil: estacoCivil,
          telefone,
          telefone2,
          email,
          observacao,
          password: password || '123456',
          rua,
          numero,
          complemento,
          bairro,
          cidade,
          cep,
          nomeConjuge,
          cargo_id: cargoId,
          function_id: functionId,
          setor_id: setorId,
        });
        console.log(response);
        limpaCampos();
        toast.success('Membro criado com sucesso');
        history.push('/listMembros');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/membro/${id}`, {
          nome: nomeMembro,
          rg,
          cpf,
          data_batismo: dataBatismo || null,
          data_nascimento: dataNascimento || null,
          profissao,
          observacao,
          estado_civil: estacoCivil,
          telefone,
          telefone2,
          rua,
          numero,
          complemento,
          bairro,
          cidade,
          cep,
          nomeConjuge,
          cargo_id: cargoId,
          function_id: functionId,
          setor_id: setorId,
        });
        console.log(response);
        limpaCampos();
        toast.success('Membro editado com sucesso');

        history.push(`/cadMembro/${id}/edit`);
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

  const handleGetIdCongregacao = (e) => {
    const nome = e.target.value;
    setSetor(e.target.value);
    setores.map((dado) => {
      if (nome === dado.descricao) setSetorId(dado.id);
    });
  };
  const handleGetIdFuncao = (e) => {
    const nome = e.target.value;
    setFunctionNome(e.target.value);
    funcoes.map((dado) => {
      if (nome === dado.descricao) setFunctionId(dado.id);
    });
  };
  const handleGetIdCargo = (e) => {
    const nome = e.target.value;
    setCargo(e.target.value);
    cargos.map((dado) => {
      if (nome === dado.descricao) setCargoId(dado.id);
    });
  };
  const handleInput = (e, idTag) => {
    const element = document.getElementById(idTag);
    const next = e.currentTarget.nextElementSibling;
    if (idTag === 'dataBatismo')
      if (!isDate(e.target.value)) {
        next.setAttribute('style', 'display:block');
        return;
      }

    if (e.target.value.length < 3) {
      element.setAttribute('style', 'border-color:red');
      next.setAttribute('style', 'display:block');
      element.style.borderWidth = '2px';
    } else {
      element.removeAttribute('style');
      next.removeAttribute('style');
    }
  };
  return (
    <Container>
      <h1> Novo Membro</h1>
      <Loading isLoading={isLoading} />

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="id">Número da ficha:</Form.Label>
            {id ? (
              <Form.Control id="id" type="text" value={id} disabled />
            ) : (
              <Form.Control id="maxId" type="text" value={maxId} disabled />
            )}
          </Col>
          <Col sm={12} md={9} className="my-1">
            <Form.Label htmlFor="nome">Nome completo:</Form.Label>
            <Form.Control
              id="nome"
              type="text"
              value={nomeMembro}
              onChange={(e) => {
                setNomeMembro(e.target.value.toLocaleUpperCase());
                // handleInput(e, 'nome');
              }}
              placeholder="Nome"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="rg">RG:</Form.Label>
            <Form.Control
              id="rg"
              type="text"
              value={rg}
              onChange={(e) => {
                setRg(e.target.value);
                // handleInput(e, 'rg');
              }}
              placeholder="RG"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="cpf">
              CPF:
              <InputMask
                mask="999.999.999-99"
                id="cpf"
                type="text"
                value={cpf}
                onChange={(e) => {
                  setCpf(e.target.value);
                  // handleInput(e, 'cpf');
                }}
                placeholder="000.000.000-00"
              />
              {/* <small>Minimo de 3 caracteres</small> */}
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="dataNascimento">
              Data de Nascimento:
            </Form.Label>
            <Form.Control
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => {
                setDataNascimento(e.target.value);
                handleInput(e, 'dataNascimento');
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira uma data valida
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="batizado">Batizado</Form.Label>
            <Form.Check id="sim" checked={checado} type="radio" label="Sim" />
            <Form.Check
              type="radio"
              label="Nao"
              onChange={() => {
                setBatizado(true);
                setChecado(false);
              }}
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataBatismo">Data de Batismo:</Form.Label>
            <Form.Control
              id="dataBatismo"
              type="date"
              value={dataBatismo}
              onChange={(e) => {
                setDataBatismo(e.target.value);
                // handleInput(e, 'dataBatismo');
              }}
              disabled={batizado}
            />
            <Form.Control.Feedback type="invalid">
              Insira uma data valida
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Label htmlFor="telefone">
              Celular:
              <InputMask
                mask="(99) 99999-9999"
                id="telefone"
                type="text"
                value={telefone}
                onChange={(e) => {
                  setTelefone(e.target.value);
                  // handleInput(e, 'telefone');
                }}
                placeholder="(00) 00000-0000"
              />
              {/* <small>Insira um número válido</small> */}
            </Label>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Label htmlFor="telefone2">
              Telefone 2:
              <InputMask
                mask="(99) 99999-9999"
                id="telefone2"
                type="text"
                value={telefone2}
                onChange={(e) => {
                  setTelefone2(e.target.value);
                  // handleInput(e, 'telefone');
                }}
                placeholder="(00) 00000-0000"
              />
              {/* <small>Insira um número válido</small> */}
            </Label>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <ComboBox
              title="Estado Civil"
              list={listEstadoCivil}
              text="Selecione o estado civil"
              value={estacoCivil}
              onChange={(e) => {
                setEstacoCivil(e.target.value);
                if (e.target.value === 'Casado(a)') setCasado(false);
              }}
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Nome do Cônjuge:</Form.Label>
            <Form.Control
              id="nomeConjuge"
              type="text"
              value={nomeConjuge}
              onChange={(e) => {
                setNomeConjuge(e.target.value);
                // handleInput(e, 'nomeConjuge');
              }}
              placeholder="Nome do Conjuge"
              disabled={casado}
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="profissao">Profissão:</Form.Label>
            <Form.Control
              id="profissao"
              type="text"
              value={profissao}
              onChange={(e) => {
                setProfissao(e.target.value.toLocaleUpperCase());
                // handleInput(e, 'profissao');
              }}
              placeholder="Insira a profissão"
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira uma data valida
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <ComboBox
              title="Selecione a Congregação"
              list={setores}
              value={setor}
              onChange={handleGetIdCongregacao}
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <ComboBox
              title="Selecione o cargo"
              list={cargos}
              value={cargo}
              onChange={handleGetIdCargo}
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <ComboBox
              title="Selecione a função"
              list={funcoes}
              value={functionNome}
              onChange={handleGetIdFuncao}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="email">E-mail:</Form.Label>
            <Form.Control
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.toLocaleLowerCase());
                // handleInput(e, 'email');
              }}
              placeholder="exemplo@email.com"
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira um e-mail válido
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="password">Senha:</Form.Label>
            <Form.Control
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // handleInput(e, 'password');
              }}
              placeholder="Senha"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="email">Rua:</Form.Label>
            <Form.Control
              id="rua"
              type="text"
              value={rua}
              onChange={(e) => {
                setRua(e.target.value.toLocaleLowerCase());
                // handleInput(e, 'email');
              }}
              placeholder="Nome da rua"
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira um nome de rua válido
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={2} className="my-1">
            <Form.Label htmlFor="numero">Número:</Form.Label>
            <Form.Control
              id="numero"
              type="text"
              value={numero}
              onChange={(e) => {
                setNumero(e.target.value);
                // handleInput(e, 'numero');
              }}
              placeholder="Número"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="numero">Complemento:</Form.Label>
            <Form.Control
              id="complemento"
              type="text"
              value={complemento}
              onChange={(e) => {
                setComplemento(e.target.value);
                // handleInput(e, 'complemento');
              }}
              placeholder="Complemento"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="email">Bairro:</Form.Label>
            <Form.Control
              id="bairro"
              type="text"
              value={bairro}
              onChange={(e) => {
                setBairro(e.target.value.toLocaleLowerCase());
                // handleInput(e, 'email');
              }}
              placeholder="Bairro"
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira um nome de rua válido
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="cidade">Cidade:</Form.Label>
            <Form.Control
              id="cidade"
              type="text"
              value={cidade}
              onChange={(e) => {
                setCidade(e.target.value);
                // handleInput(e, 'cidade');
              }}
              placeholder="Cidade"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="cep">
              CEP:
              <InputMask
                mask="99999-999"
                id="telefone"
                type="text"
                value={cep}
                onChange={(e) => {
                  setCep(e.target.value);
                  // handleInput(e, 'telefone');
                }}
                placeholder="15400-000"
              />
              {/* <small>Insira um número válido</small> */}
            </Label>
          </Col>
        </Row>
        <Row>
          <Form.Label htmlFor="observacao">Observação:</Form.Label>
          <Form.Control
            as="textarea"
            id="observacao"
            type="observacao"
            value={observacao}
            onChange={(e) => {
              setObservacao(e.target.value);
              // handleInput(e, 'email');
            }}
            placeholder="Observação"
            required
          />
          <Form.Control.Feedback type="invalid">
            A observação não pode ter mais que 200 caracteres válido
          </Form.Control.Feedback>
        </Row>

        <button type="submit">Salvar</button>
      </Form>
    </Container>
  );
}
CadMembro.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
