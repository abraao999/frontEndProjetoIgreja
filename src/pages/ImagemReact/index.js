import React, { useState } from "react";
import Webcam from "react-webcam";

// import { Container } from './styles';
const videoConstraints = {
  width: 649,
  height: 480,
  facingMode: "user",
};
const ImagemReact = () => {
  const [imageSrc, setImageSrc] = useState("");
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const aux = webcamRef.current.getScreenshot();
    setImageSrc(aux);
  }, [webcamRef]);
  return (
    <>
      <Webcam
        audio={false}
        height={480}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
      <img src={imageSrc || ""} alt="" />
    </>
  );
};
export default ImagemReact;
