import styled from "styled-components";
import * as colors from "../../../config/colors";

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
export const Form2 = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  small {
    color: red;
    display: none;
  }
  label {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  label + label {
    margin-left: 3px;
  }
  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  input {
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    padding: 0 10px;
    border-radius: 4px;
    margin-top: 5px;
    &:focus {
      border: 1px solid ${colors.primaryColor};
    }
  }
  select {
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    padding: 0 10px;
    border-radius: 4px;
    margin: 5px 0;
    &:focus {
      border: 1px solid ${colors.primaryColor};
    }
  }
`;
export const Table = styled.table`
  margin-top: 20px;
  max-width: 80%;
`;
export const Listagem = styled.div`
  h3 {
    margin: 30px;
    display: flex;
    justify-content: center;
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
  select {
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    padding: 0 10px;
    border-radius: 4px;
    margin-top: 8px;
    &:focus {
      border: 4px solid ${colors.inputBorder};
    }
  }
`;
