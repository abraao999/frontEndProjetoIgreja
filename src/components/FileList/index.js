/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";

import { Container, FileInfo, Preview } from "./styles";
import { MdLink, MdError, MdCheckCircle } from "react-icons/md";
import { Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
const FileList = ({ files, handleRemoveIten }) => (
  <Container>
    {files.map((file) => (
      <li key={file.id}>
        <FileInfo>
          <Preview src={file.preview} />
          <div>
            <strong>{file.name}</strong>
            <span>{file.readableSize}</span>
          </div>
        </FileInfo>
        <div>
          <Button variant="danger" onClick={handleRemoveIten}>
            <FaTrash size={16} />
          </Button>

          {file.uploaded && <MdCheckCircle size={24} color="#78e5d5" />}
          {file.error && <MdError size={24} color="#e57878" />}
        </div>
      </li>
    ))}
  </Container>
);

export default FileList;
