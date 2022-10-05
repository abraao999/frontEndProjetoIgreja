/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaCamera, FaSave } from "react-icons/fa";
import Webcam from "react-webcam";
import { Container } from "../../styles/GlobalStyles";
import PropTypes from "prop-types";
import { get } from "lodash";
import axios from "../../services/axios";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

// import { Container } from './styles';
const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};
const CadFoto = ({ match }) => {
  const id = get(match, "params.id", "");
  const action = get(match, "params.action", "");

  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [show, setShow] = useState(true);
  const webcamRef = React.useRef(null);

  const handleCapture = React.useCallback(() => {
    const aux = webcamRef.current.getScreenshot();
    setImageSrc(aux);
    setShow(false);
  }, [webcamRef]);
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/ebdFoto", {
        url: imageSrc,
      });
      await axios.put(`/${action}/${id}`, {
        foto_id: res.data.id,
      });
    } catch (error) {
      toast.error("Não foi possivel alterar a foto");
    }

    setIsLoading(false);
    toast.success("Foto alterado com sucesso");
    history.back();
  };
  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Row>
        <Col md={show ? { offset: 3, span: 6 } : 6}>
          <p style={{ fontSize: "1.5rem" }}>Prévia</p>

          <Webcam
            audio={false}
            ref={webcamRef}
            width={"100%"}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        </Col>
        <Col md={6}>
          <p style={{ fontSize: "1.5rem" }} hidden={show}>
            Foto
          </p>
          <img src={imageSrc} alt="" width={"100%"} />
        </Col>
      </Row>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button
          variant="success"
          onClick={handleCapture}
          style={{ marginTop: "2px" }}
        >
          <FaCamera size={24} />
        </Button>
        <Button
          variant="success"
          size="large"
          onClick={handleSubmit}
          style={{ marginTop: "2px" }}
          hidden={show}
        >
          <FaSave size={24} />
        </Button>
      </div>
    </Container>
  );
};
CadFoto.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
export default CadFoto;
