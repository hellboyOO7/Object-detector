"use client";
import {
  renderPredections,
  renderPredictions,
} from "@/utils/render-predictions";
import { load as cocoSSDload } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);
  let detectInteval;

  const runCoco = async () => {
    setIsLoading(true);
    const net = await cocoSSDload();
    setIsLoading(false);

    detectInteval = setInterval(() => {
      runObjectDetection(net);
    }, 10);
  };

  async function runObjectDetection(net) {
    if (
      canvasRef.current &&
      webCamRef.current !== null &&
      webCamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webCamRef.current.video.videoWidth;
      canvasRef.current.height = webCamRef.current.video.videoHeight;

      // find all the detected objects
      const detectedObjects = await net.detect(
        webCamRef.current.video,
        undefined,
        0.6
      );
      // console.log(detectedObjects);
      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, context);
    }
  }

  const showMyVideo = () => {
    if (
      webCamRef.current !== null &&
      webCamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webCamRef.current.video.videoWidth;
      const myVideoHeight = webCamRef.current.video.videoHeight;

      webCamRef.current.video.width = myVideoWidth;
      webCamRef.current.video.height = myVideoHeight;
    }
  };

  useEffect(() => {
    runCoco();
    showMyVideo();
  }, []);

  return (
    <div className="mt-8">
      {isLoading ? (
        <div>Loading AI model</div>
      ) : (
        <div className="relative flex justify-center items-center gradient-border p-1.5 rounded-md">
          {/* web cam  */}
          <Webcam
            ref={webCamRef}
            className="lg:h-[720px] w-full rounded-md"
            muted
          />
          {/* canvas  */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 z-9999 w-full lg:h-[720px]"
          ></canvas>
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
