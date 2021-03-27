import styled from 'styled-components';
import * as colors from '../../config/colors';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
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
`;
export const ListFuncoesConteiner = styled.div`
  margin-top: 20px;
  max-width: 300px;
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    padding: 5px 0;
  }
  div + div {
    border-top: 1px solid #eee;
  }
`;
export const Listagem = styled.div`
  h3 {
    margin: 30px;
    display: flex;
    justify-content: center;
  }
`;
