import styled, { createGlobalStyle } from "styled-components";
import * as colors from "../config/colors";
import "react-toastify/dist/ReactToastify.css";
import "react-circular-progressbar/dist/styles.css";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    background:white;
    color: ${colors.primaryDarkColor};
  }

  html, body, #root {
    height: 100%;
  }

  button {
    cursor: pointer;
    background: ${colors.primaryColor};
    border: none;
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 700;
    transition:all 300ms
  }
  button:hover{

    filter: brightness(75%);

  }


  a {
    text-decoration: none;
    color: ${colors.primaryColor};
  }
  a:hover{
    text-decoration: none;
    color: ${colors.primaryLigthColor};
  }

  ul {
    list-style: none;
  }
  table{
    text-align:center
  }

  /* body .Toastify .Toastify__toast-container .Toastify__toast--success {
    background: ${colors.successColor}
  } */

  /* body .Toastify .Toastify__toast-container .Toastify__toast--error {
    background: ${colors.errorColor}
  } */
`;

export const Container = styled.section`
  max-width: 1100px;
  background: #fff;
  margin: 30px auto;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  @media (max-width: 800px) {
    max-width: 100%;
    padding: 10px;
    margin: 0;
  }
`;
