import styled from 'styled-components';
import * as colors from '../../config/colors';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  small {
    color: red;
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
  td {
    text-align: center;
  }
  th {
    text-align: center;
  }
`;
export const Listagem = styled.div`
  h3 {
    margin: 30px;
    display: flex;
    justify-content: center;
  }
`;
export const Check = styled.input`
  color: ${colors.primaryColor};
`;
export const ProfilePicture = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 20px;
  position: relative;
  margin-top: 20px;
  img {
    width: 180px;
    height: 180px;
    border-radius: 50%;
  }
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    position: absolute;
    bottom: 0;
    color: #fff;
    background: ${colors.primaryColor};
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
`;
