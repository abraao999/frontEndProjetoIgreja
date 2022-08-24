/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";

import { Container, FileInfo, Preview } from "./styles";
import { MdLink, MdError, MdCheckCircle } from "react-icons/md";
const FileList = ({ files, handleRemoveIten }) => (
  <Container>
    {files.map((file) => (
      <li key={file.id}>
        <FileInfo>
          <Preview src={file.preview} />
          <div>
            <strong>{file.name}</strong>
            <span>
              {file.readableSize}
              <button onClick={handleRemoveIten}>Excluir</button>
            </span>
          </div>
        </FileInfo>
        <div>
          {!file.uploaded && !file.error && (
            <CircularProgressbar
              styles={{ root: { width: 24 }, path: { stroke: "#7159c1" } }}
              strokeWidth={18}
              value={file.progress}
            />
          )}
          {file.url && (
            <a href={file.preview} target="_black" rel="noopener noreferrer">
              <MdLink style={{ marginRight: 8 }} size={24} color="#222" />
            </a>
          )}
          {file.uploaded && <MdCheckCircle size={24} color="#78e5d5" />}
          {file.error && <MdError size={24} color="#e57878" />}
        </div>
      </li>
    ))}
  </Container>
);

export default FileList;
