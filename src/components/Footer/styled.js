import styled from 'styled-components';
import * as colors from '../../config/colors';

export const Nav = styled.nav`
  background: ${colors.primaryColor};
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const Conteiner = styled.div`
  /* background: ${colors.primaryLigthColor}; */
  padding: 5px;
  display: flex;
  background:${colors.primaryLigthColor};
  max-width: 100%;
  a {
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  a:hover {
    color: ${colors.primaryColor};
  }
  img {
    height: 36px;
    width: 36px;
  }
  button {
    background: ${colors.primaryLigthColor};
  }
  /* ul li a {
    color: ${colors.primaryColor};
  } */
  button:hover {
    color: ${colors.primaryColor};
    background: ${colors.primaryLigthColor};
    filter: brightness(100%);
  }
  svg {
    margin-right: 5px;
  }
  iframe{
    max-width:300px
  }
`;
