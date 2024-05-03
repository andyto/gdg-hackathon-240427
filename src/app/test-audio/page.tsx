"use client";

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import MicRecorder from "mic-recorder-to-mp3";
import { chat } from "@/lib/gemini";

const addAudioElement = (blob: any) => {
  const url = URL.createObjectURL(blob);
  const audio = document.createElement("audio");
  audio.src = url;
  audio.controls = true;
  document.body.appendChild(audio);
};

const recorder = new MicRecorder({
  bitRate: 128,
});

function blobToBase64(blob: any) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve(
        (reader.result as string).replace("data:", "").replace(/^.+,/, ""),
      );
    reader.readAsDataURL(blob);
  });
}

const Test = () => {
  // Start recording. Browser will request permission to use your microphone.
  const start = () =>
    recorder
      .start()
      .then(() => {
        // something else
      })
      .catch((e) => {
        console.error(e);
      });

  // Once you are done singing your best song, stop and get the mp3.
  const stop = () =>
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        // do what ever you want with buffer and blob
        // Example: Create a mp3 file and play
        const file = new File(buffer, "me-at-thevoice.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });

        const player = new Audio(URL.createObjectURL(file));
        player.play();

        return blobToBase64(blob);
      })
      .then((base64) => {
        console.log(base64);
        return chat({
          id: "audio",
          audioBase64: base64 as string,
          mimeType: "audio/mp3",
        });
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        alert("We could not retrieve your message");
        console.log(e);
      });

  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
};

export default Test;
