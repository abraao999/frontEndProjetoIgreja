import React, { useState } from "react";
import { toast } from "react-toastify";
import { isEmail } from "validator";
import { get } from "lodash";

import { useDispatch, useSelector } from "react-redux";
import history from "../../services/history";
import * as actions from "../../store/modules/auth/actions";
import { Container } from "../../styles/GlobalStyles";
import { Form } from "./styled";
import Loading from "../../components/Loading";
import { Row } from "react-bootstrap";

export default function Login(props) {
  const dispath = useDispatch();
  const prevPath = get(props, "location.state.prevPath", "/");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLoading = useSelector((state) => state.auth.isLoading);

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

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>Login</h1>
      <Form>
        <Row style={{ display: "flex", justifyContent: "center" }}>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o seu e-mail"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite o sua senha"
          />
          <button type="submit" onClick={handleSubmit}>
            Entrar
          </button>
        </Row>
      </Form>
    </Container>
  );
}
