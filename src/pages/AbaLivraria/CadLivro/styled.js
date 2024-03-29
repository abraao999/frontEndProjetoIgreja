import styled, { css } from "styled-components";

const dragActive = css`
  border-color: #78e5d5;
`;
const dragReject = css`
  border-color: #e57878;
`;
export const Listagem = styled.div`
  h3 {
    margin: 30px;
    display: flex;
    justify-content: center;
  }
`;
const messageColors = {
  default: "#999",
  error: "#e57878",
  success: "#78e5d5",
};
export const UploadMessage = styled.p`
  display: flex;
  color: ${(props) => messageColors[props.type || "default"]};
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`;
export const DropContainer = styled.div.attrs({
  className: "Dropzone",
})`
  border: 1px dashed #ddd;
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  transition: height 0.2s ease;
  ${(props) => props.isDragReject && dragReject}
  ${(props) => props.isDragActive && dragActive}
`;
