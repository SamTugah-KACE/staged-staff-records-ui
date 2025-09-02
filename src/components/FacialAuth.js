// src/components/FacialAuth.js
import React, { useState, useRef, useEffect } from 'react';
import './FacialAuth.css';

const FacialAuth = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    if (!captured) {
      navigator.mediaDevices.getUserMedia({ video: { width: 300, height: 300, facingMode: 'user' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            drawVideoToCanvas();
          }
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    }
    return () => {
      cancelAnimationFrame(animationRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [captured]);

  const drawVideoToCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    const draw = () => {
      if (videoRef.current && !captured) {
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        animationRef.current = requestAnimationFrame(draw);
      }
    };
    draw();
  };

  const handleCapture = () => {
    // Get the current frame data URL
    const dataURL = canvasRef.current.toDataURL('image/jpeg');
    // Create an Image to ensure the canvas shows the captured image
    const ctx = canvasRef.current.getContext('2d');
    const capturedImg = new Image();
    capturedImg.src = dataURL;
    capturedImg.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(capturedImg, 0, 0, canvasRef.current.width, canvasRef.current.height);
      setCaptured(true);
      cancelAnimationFrame(animationRef.current);
      if (onCapture) {
        onCapture(dataURL);
      }
    };
  };

  const handleRecapture = () => {
    setCaptured(false);
    drawVideoToCanvas();
  };

  return (
    <div className="facial-auth-container">
      <canvas ref={canvasRef} width={300} height={300} className="facial-canvas" />
      {/* Hidden video element */}
      <video ref={videoRef} style={{ display: 'none' }} />
      <button onClick={captured ? handleRecapture : handleCapture} className="capture-btn">
        {captured ? "Re-capture" : "Capture"}
      </button>
    </div>
  );
};

export default FacialAuth;
