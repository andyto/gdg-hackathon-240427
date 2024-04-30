// import {useAppStore} from "@/app/htp-test/_components/AppStore";

import { chat } from "@/lib/gemini";
// import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { useAppStore } from "@/app/htp-test/_components/AppStore";
import { Button } from "@/components/ui/button";

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve(
        (reader.result as string).replace("data:", "").replace(/^.+,/, ""),
      );
    reader.onerror = reject;
  });

export default function Step0() {
  const id = useAppStore((state) => state.id);
  const drawing = useAppStore((state) => state.drawing);
  const setDrawing = useAppStore((state) => state.setDrawing);

  const [imageSrc, setImageSrc] = useState<string | undefined>();

  useEffect(() => {
    if (drawing) {
      const fr = new FileReader();
      fr.onload = function () {
        // document.getElementById(outImage).src = fr.result;
        setImageSrc(fr.result as string);
      };
      fr.readAsDataURL(drawing);
    } else {
      setImageSrc(undefined);
    }
  }, [drawing]);

  const onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void = useCallback((acceptedFiles) => {
    setDrawing(acceptedFiles[0]);
  }, []);

  const onDropRejected: (
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void = useCallback((acceptedFiles) => {
    // upload file to run query
    alert("File rejected");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg"],
    },
    onDropRejected,
  });

  const onSubmitDrawing = useCallback(async () => {
    // runP1(drawing as File);
    if (!drawing) {
      return;
    }
    const drawingBase64 = (await toBase64(drawing)) as string;
    await chat({
      id: id!,
      drawingBase64,
      mimeType: drawing.type,
    });
  }, [drawing]);

  return (
    <main>
      <h1>Step1</h1>
      {imageSrc && <img src={imageSrc} alt="drawing" className={"w-96"} />}
      <div {...getRootProps()} className={"border p-4"}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <div className={"p-4"}>
        <Button onClick={onSubmitDrawing}>Submit</Button>
      </div>
    </main>
  );
}
