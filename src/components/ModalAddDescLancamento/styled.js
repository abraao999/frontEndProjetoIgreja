import styled from 'styled-components';
import * as colors from '../../config/colors';

export const CancelarButton = styled.nav`
  cursor: pointer;
  background: ${colors.dangerColor};
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 700;
  transition: all 300ms;

  button:hover {
    filter: brightness(75%);
  }
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;

  small {
    color: red;
    display: none;
  }
  label {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 5px;
  }

  input {
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    padding: 0 10px;
    border-radius: 4px;
    &:focus {
      border: 1px solid ${colors.primaryColor};
    }
  }
`;
