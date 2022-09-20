import styled from "styled-components";
import * as colors from "../../config/colors";

export const ContainerLogin = styled.section`
  display: flex;
  p {
    font-size: 2rem;
  }
  div {
    align-items: space-around;
    background: #fff;
    margin: 30px auto;
    padding: 30px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  div + div {
    margin-left: 5px;
  }
  button {
    margin-top: 5px;
  }
  @media (max-width: 700px) {
    flex-direction: column;
    div {
      width: 100%;
    }
    div + div {
      margin: 0px;
    }
  }
`;
export const Label = styled.label`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* margin-bottom: 20px; */
  small {
    color: red;
    display: block;
  }
  input {
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    padding: 0 10px;
    border-radius: 4px;
    margin-top: 10px;
    &:focus {
      border: 4px solid ${colors.inputBorder};
    }
  }
`;
