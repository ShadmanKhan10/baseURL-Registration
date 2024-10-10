import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import capture from "../assets/camera.png";
import close from "../assets/close.png";

export default function CaptureImage({
  capturedImage,
  setCapturedImage,
  setShowCaptureImage,
  setImageError,
}) {
  const [imageClicked, setImageClicked] = useState(false);
  const webcamRef = useRef(null);

  const convertToPNG = (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: 1920,
      height: 1080,
    });
    console.log(imageSrc);
    if (imageSrc) {
      const pngImage = await convertToPNG(imageSrc);
      setCapturedImage(pngImage);
      setImageClicked(true);
      setShowCaptureImage(false);
      setImageError(false);
    }
  };

  const closepopUp = () => {
    setShowCaptureImage(false);
  };

  return (
    <>
      <div className="capture-preview-container">
        <div className="close-container" onClick={closepopUp}>
          <img src={close} alt="close" className="close-image" />
        </div>
        <div className="webcam-container">
          {!imageClicked && (
            <Webcam
              mirrored={false}
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png" // Capture in webp format
              className="webcam-preview"
              videoConstraints={{
                facingMode: "user",
                width: 1920,
                height: 1080,
              }}
            />
          )}

          {imageClicked && capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="webcam-preview"
            />
          )}
        </div>
        {!imageClicked && (
          <div className="capture-btn-container">
            <img
              onClick={handleCapture}
              src={capture}
              alt="capture"
              className="capture-btn"
            />
          </div>
        )}{" "}
      </div>
    </>
  );
}
