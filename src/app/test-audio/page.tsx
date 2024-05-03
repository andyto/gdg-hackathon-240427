"use client";

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import MicRecorder from "mic-recorder-to-mp3";
import { chat } from "@/lib/gemini";

const recorder = new MicRecorder({ bitRate: 128 });
const useRecorder = (recorder: MicRecorder) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [blob, setBlob] = React.useState<Blob | null>(null);
  const start = () => {
    setIsRecording(true);
    return recorder.start();
  };

  const stop = () => {
    setIsRecording(false);
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        setBlob(blob);
      });
  };

  return {
    isRecording,
    start,
    stop,
    blob,
  };
};

function blobToBase64(blob: any) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve(
        (reader.result as string).replace("data:", "").replace(/^.+,/, "")
      );
    reader.readAsDataURL(blob);
  });
}

const Test = () => {
  // Start recording. Browser will request permission to use your microphone.
  const { start, stop, blob, isRecording } = useRecorder(recorder);

  useEffect(() => {
    if (blob) {
      blobToBase64(blob)
        .then((base64) => {
          console.log(base64);
          return chat({
            id: "test",
            audioBase64: base64 as string,
            mimeType: "audio/mp3",
          });
        })
        .then((response) => {
          console.log(response);
        });
    }
  }, [blob]);

  return (
    <div>
      {isRecording ? (
        <>
          <p>Recording...</p>
          <button onClick={stop}>Stop</button>
        </>
      ) : (
        <>
          <p>Not recording</p>
          <button onClick={start}>Start</button>
        </>
      )}
    </div>
  );
};

export default Test;
