import styled from "styled-components";

export const Preview = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 5px;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  margin: 10px;
`;
