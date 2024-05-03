import MicRecorder from "mic-recorder-to-mp3";
import React, { use } from "react";

const useRecorder = (recorder: MicRecorder) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [blob, setBlob] = React.useState<Blob | null>(null);
  const [buffer, setBuffer] = React.useState<BlobPart[]>([]);
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
        setBuffer(buffer);
      });
  };

  return {
    isRecording,
    start,
    stop,
    blob,
    buffer,
  };
};

export default useRecorder;
