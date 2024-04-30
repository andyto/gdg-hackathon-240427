"use client";

import { useAppStore } from "@/app/htp-test/_components/AppStore";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { chat } from "@/lib/gemini";

import InitialImage from "@/assets/images/initial.svg";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChatBubble from "./_components/ChatBubble";
import { Input } from "@/components/ui/input";

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve(
        (reader.result as string).replace("data:", "").replace(/^.+,/, "")
      );
    reader.onerror = reject;
  });

export default function HtpTest() {
  const genId = useAppStore((state) => state.genId);
  const id = useAppStore((state) => state.id);
  const drawing = useAppStore((state) => state.drawing);
  const setDrawing = useAppStore((state) => state.setDrawing);

  const [imageSrc, setImageSrc] = useState<string | undefined>();

  useEffect(() => {
    genId();
  }, []);

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
    event: DropEvent
  ) => void = useCallback((acceptedFiles) => {
    setDrawing(acceptedFiles[0]);
  }, []);

  const onDropRejected: (
    fileRejections: FileRejection[],
    event: DropEvent
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

  const onFollowUp1 = async () => {
    await chat({
      id: id!,
      userPrompt: "It's my house!!!",
    });
  };

  const onFollowUp2 = async () => {
    await chat({
      id: id!,
      userPrompt: "It's my house!!!",
    });
  };

  const onFollowUp3 = async () => {
    await chat({
      id: id!,
      userPrompt: "The tree is green.",
    });
  };

  const onFollowUp4 = async () => {
    await chat({
      id: id!,
      userPrompt: "I like my picture.",
    });
  };

  return (
    <main className="flex items-center h-[100vh]">
      <div className="container mx-auto">
        <Card {...getRootProps()} className={"border p-4 bg-gray-50 relative"}>
          <CardHeader>
            <CardTitle>Gemini HTP</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[70vh] overflow-auto ">
            {!imageSrc && !drawing && (
              <div className="flex justify-center flex-col items-center p-4">
                <Image src={InitialImage} alt="Initial" width={300} />
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Upload your House Tree Person drawing to start ...</p>
                ) : (
                  <p className="mt-8 text-center">
                    Drag 'n' drop your House Tree Person drawing here, or click
                    to select files
                  </p>
                )}
              </div>
            )}
            {imageSrc && (
              <div className="flex flex-col gap-4 pb-16 overflow-auto flex-1">
                <ChatBubble
                  isSelf={true}
                  message={
                    <img src={imageSrc} alt="drawing" className={"w-96"} />
                  }
                  receivedAt={new Date()}
                />
                <ChatBubble
                  isSelf={false}
                  message={
                    "please describe the drawing in a few words, e.g. 'It's my house!!!'"
                  }
                  receivedAt={new Date()}
                />
                <ChatBubble
                  isSelf={false}
                  message={
                    "please describe the drawing in a few words, e.g. 'It's my house!!!'"
                  }
                  receivedAt={new Date()}
                />
                <ChatBubble
                  isSelf={false}
                  message={
                    "please describe the drawing in a few words, e.g. 'It's my house!!!'"
                  }
                  receivedAt={new Date()}
                />
              </div>
            )}
            {!drawing && (
              <div className={"p-4"}>
                <Button onClick={onSubmitDrawing}>Upload</Button>
                {/* <Button onClick={onFollowUp1}>Follow up 1</Button>
          <Button onClick={onFollowUp2}>Follow up 2</Button>
          <Button onClick={onFollowUp3}>Follow up 3</Button>
          <Button onClick={onFollowUp4}>Follow up 4</Button> */}
              </div>
            )}
            {drawing && (
              <div className="flex bg-gray-300 absolute bottom-0 left-0 right-0 p-4">
                <Input
                  placeholder="Type your response here ..."
                  className="flex-1"
                />
                <Button>Send</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
