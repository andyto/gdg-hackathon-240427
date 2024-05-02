"use client";

import React from "react";
import ReactDOM from "react-dom/client";
import { AudioRecorder } from "react-audio-voice-recorder";

const addAudioElement = (blob: any) => {
  const url = URL.createObjectURL(blob);
  const audio = document.createElement("audio");
  audio.src = url;
  audio.controls = true;
  document.body.appendChild(audio);
};

const Test = () => {
  return (
    <AudioRecorder
      onRecordingComplete={addAudioElement}
      audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }}
      downloadOnSavePress={false}
      downloadFileExtension="mp3"
    />
  );
};

export default Test;
