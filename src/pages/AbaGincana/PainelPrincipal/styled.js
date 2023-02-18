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
  background: #fff;
  padding: 25px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  justify-content: start;
  align-items: center;
  span {
    margin-left: 10px;
  }
`;
