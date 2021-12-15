import styled from 'styled-components';
import * as colors from '../../../config/colors';

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
export const Box = styled.div`
  background: #fff;
  margin: 10px auto;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  h3 {
    font-weight: bold;
  }
  p {
    font-size: 18px;
    margin: 0;
  }
  li {
    font-size: 17px;
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
export const LabelInput = styled.label`
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
