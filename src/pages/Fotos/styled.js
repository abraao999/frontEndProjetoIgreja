import styled from 'styled-components';
import * as colors from '../../config/colors';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  label {
    width: 180px;
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #eee;
    border: 5px dashed ${colors.primaryColor};
    margin: 30px auto;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
  }
  input {
    display: none;
  }
  img {
    width: 180px;
    height: 180px;
  }
`;
export const ProfilePicture = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 20px;
  position: relative;
  margin-top: 20px;

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

export const Titulo = styled.h1`
  display: flex;
  justify-content: center;
`;
