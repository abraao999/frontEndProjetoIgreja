import styled from 'styled-components';
import * as colors from '../../config/colors';

export const List = styled.div`
  display: flex;
  flex-direction: column;

  button {
    cursor: pointer;
    color: #000;
    padding: 10px 20px;
    border-radius: 0;
    font-weight: 700;
    transition: all 300ms;
    max-width: 500px;
  }
  button + button {
    cursor: pointer;
    color: #000;

    border-radius: 0;
    padding: 10px 20px;
    font-weight: 700;
    transition: all 300ms;
    max-width: 500px;
  }
  button:hover {
    filter: brightness(90%);
  }
`;
export const ContainerBox = styled.section`
  background: #fff;
  margin: 30px auto;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
