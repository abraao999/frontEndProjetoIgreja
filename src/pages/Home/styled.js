import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const AlunoConteiner = styled.div`
  margin-top: 20px;
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
  }
  div + div {
    border-top: 1px solid #eee;
  }
`;
export const ProfilePicture = styled.div`
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
`;
export const NovoAluno = styled(Link)`
  display: block;
  padding: 20px 0 10px 0;
`;

export const ContainerBox = styled.section`
  display: flex;
  padding: 30px;
  justify-content: center;
  align-items: center;
  h2 {
    font-family: 'Raleway';
    color: #4d4e53;
  }
`;
export const MyCard = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 5px;
  @media (min-width: 800px) {
    img {
      height: 200px;
    }
  }
  div {
    padding-bottom: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 250px;
    justify-content: space-between;
    p {
      text-align: justify;
    }
    span {
      font-weight: bold;
    }
  }
`;
export const Container = styled.section`
  max-width: 95%;
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
