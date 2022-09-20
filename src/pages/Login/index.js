import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { isEmail } from "validator";
import { get } from "lodash";

import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/modules/auth/actions";
import { Container } from "../../styles/GlobalStyles";
import Loading from "../../components/Loading";
import { Button, Form } from "react-bootstrap";
import { ContainerLogin, Label } from "./styled";
import ReactInputMask from "react-input-mask";
import axios from "../../services/axios";

export default function Login(props) {
  const dispath = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const prevPath = get(props, "location.state.prevPath", "/");
  const [email, setEmail] = useState("");
  const [IsLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  useEffect(() => {
    async function getData() {
      if (isLoggedIn) {
        dispath(actions.loginFailure());
      }
    }
    getData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = false;

    if (!isEmail(email)) {
      formErrors = true;
      toast.error("E-mail invalido");
    }
    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error("Senha invalida");
    }
    if (formErrors) return;

    dispath(actions.loginRequest({ email, password, prevPath }));
  };
  // const handSendEmail = async () => {
  //   setIsLoading(true);
  //   // let bodyHtml = "";
  //   // const id = 0;
  //   const response = await axios.get("/membro/1");
  //   console.log(response.data.cpf === cpf);
  //   // response.data.map((dado) => {
  //   //   if (String(dado.cpf) === String(cpf)) console.log("aqui");
  //   // });

  //   // bodyHtml += `
  //   //      <div>
  //   //      <p><strong>Clique o link abaixo para redefinir a sua senha </strong></p>
  //   //      <p><a href='https://adbelemolimpia.herokuapp.com/editPass/${id}'>Redefina a sua senha: </a>
  //   //      </div>`;
  //   // try {
  //   //   await axios.post("/sendEmail", {
  //   //     bodyHtml,
  //   //     email,
  //   //   });
  //   //   toast.success("Reserva efetuada com sucesso");
  //   // } catch (error) {
  //   //   toast.error("Desculpe mas não foi possível enviar sua solicitaçãos");
  //   // }
  //   setIsLoading(false);
  // };
  return (
    <Container>
      <Loading isLoading={IsLoading} />

      <ContainerLogin>
        <div style={{ flex: 1 }}>
          <p>Entrar</p>
          <Form.Label htmlFor="descricao">E-mail:</Form.Label>

          <Form.Control
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o seu e-mail"
          />

          <Form.Label htmlFor="descricao">Senha:</Form.Label>

          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite o sua senha"
          />
          <Button variant="success" onClick={handleSubmit}>
            Entrar
          </Button>
        </div>
        <div style={{ flex: 1 }}>
          <p>Primeiro Acesso</p>
          <Label htmlFor="telefone">
            Celular:
            <ReactInputMask
              mask="999.999.999-99"
              id="telefone"
              type="text"
              value={cpf}
              onChange={(e) => {
                setCpf(e.target.value);
                // handleInput(e, 'telefone');
              }}
              placeholder="000.000.000-00"
            />
            {/* <small>Insira um número válido</small> */}
          </Label>

          <Form.Label htmlFor="descricao">Data de Nascimento:</Form.Label>

          <Form.Control
            type="date"
            inputMode="pt-BR"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            placeholder="Digite o sua senha"
          />
          {/* <Button variant="success" onClick={handSendEmail}>
            Entrar
          </Button> */}
        </div>
      </ContainerLogin>
    </Container>
  );
}
