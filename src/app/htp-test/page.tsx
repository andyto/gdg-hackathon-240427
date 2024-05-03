"use client";

import { useAppStore } from "@/app/htp-test/_components/AppStore";
import {
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import GettingCoffeeImage from "@/assets/images/getting_coffee.svg";
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  StopIcon,
} from "@heroicons/react/24/solid";
import IconImage from "@/assets/images/icon-2.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import MicRecorder from "mic-recorder-to-mp3";
import useRecorder from "../hooks/audio";
import { cn } from "@/lib/utils";

const recorder = new MicRecorder({ bitRate: 128 });

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");

  const ref = useRef<HTMLDivElement>(null);

  const { start, stop, blob, buffer, isRecording } = useRecorder(recorder);

  useEffect(() => {
    if (buffer.length > 0) {
      const file = new File(buffer, "me-at-thevoice.mp3", {
        type: "audio/mp3",
        lastModified: Date.now(),
      });

      setIsLoading(true);
      pushChat({
        isSelf: true,
        message: (
          <audio controls>
            <source src={URL.createObjectURL(file)} type="audio/mp3" />
          </audio>
        ),
        receivedAt: new Date(),
      });

      toBase64(file)
        .then((base64) => {
          const textRes = chat({
            id: id!,
            audioBase64: base64 as string,
            mimeType: "audio/mp3",
          });

          return textRes;
        })
        .then((textRes) => {
          setIsLoading(false);

          pushChat({
            isSelf: false,
            message: textRes,
            receivedAt: new Date(),
          });
        });
    }
  }, [buffer]);

  const [chats, setChats] = useState<
    {
      isSelf: boolean;
      message: string | ReactNode;
      receivedAt: Date;
    }[]
  >([]);

  const pushChat = (chat: {
    isSelf: boolean;
    message: string | ReactNode;
    receivedAt: Date;
  }) => {
    setChats((prev) => [...prev, chat]);
  };

  useEffect(() => {
    genId();
  }, []);

  useEffect(() => {
    if (drawing) {
      const fr = new FileReader();
      fr.onload = function () {
        setImageSrc(fr.result as string);
        // pushChat({
        //   isSelf: true,
        //   message: (
        //     <img src={fr.result as string} alt="drawing" className={"w-96"} />
        //   ),
        //   receivedAt: new Date(),
        // });
        submitDrawing();
      };
      fr.readAsDataURL(drawing);
    } else {
      setImageSrc(undefined);
    }
  }, [drawing]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ref, chats]);

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
    disabled: !!drawing,
    onDrop,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg"],
    },
    onDropRejected,
  });

  const submitDrawing = async () => {
    if (!drawing) {
      return;
    }
    setIsLoading(true);
    const drawingBase64 = (await toBase64(drawing)) as string;
    const textRes = await chat({
      id: id!,
      drawingBase64,
      mimeType: drawing.type,
    });

    setIsLoading(false);

    pushChat({
      isSelf: false,
      message: textRes,
      receivedAt: new Date(),
    });
  };

  // const onFollowUp1 = async () => {
  //   await chat({
  //     id: id!,
  //     userPrompt: "It's my house!!!",
  //   });
  // };
  //
  // const onFollowUp2 = async () => {
  //   await chat({
  //     id: id!,
  //     userPrompt: "It's my house!!!",
  //   });
  // };
  //
  // const onFollowUp3 = async () => {
  //   await chat({
  //     id: id!,
  //     userPrompt: "The tree is green.",
  //   });
  // };
  //
  // const onFollowUp4 = async () => {
  //   await chat({
  //     id: id!,
  //     userPrompt: "I like my picture.",
  //   });
  // };

  const onSubmit = async (ev: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();

    if (!inputText) {
      return;
    }

    pushChat({
      isSelf: true,
      message: inputText,
      receivedAt: new Date(),
    });

    setInputText("");

    setIsLoading(true);

    const textRes = await chat({
      id: id!,
      userPrompt: inputText,
    });

    pushChat({
      isSelf: false,
      message: textRes,
      receivedAt: new Date(),
    });

    setIsLoading(false);
  };

  return (
    <main className="relative flex flex-col h-[100vh] bg-yellow-50 overflow-y-hidden">
      {imageSrc && (
        <img
          src={GettingCoffeeImage.src}
          className="absolute bottom-0 right-0 z-0 opacity-30"
        />
      )}
      <div
        className="absolute h-20 left-0 right-0 top-0 p-4"
        style={{
          boxShadow: "0 2px 4px 0 rgba(0,0,0,.1)",
        }}
      >
        <div className="container mx-auto">
          <div className="text-2xl font-semibold flex">
            <img src={IconImage.src} className="w-14 h-14 inline-block mr-4" />
            <div>
              Gemini HTP Test
              <div className="text-sm font-normal">House Tree Person</div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-20 w-full"></div>
      {!imageSrc && (
        <div className="container mx-auto mt-8">
          <Card {...getRootProps()} className={"border p-4 relative bg-white"}>
            {/* <CardHeader>
              <CardTitle>Gemini HTP</CardTitle>
            </CardHeader> */}
            <CardContent className="overflow-auto">
              <div className="flex justify-center flex-col items-center p-4">
                <Image src={InitialImage} alt="Initial" width={300} />
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Upload your House Tree Person drawing to start ...</p>
                ) : (
                  <p className="mt-8 text-center">
                    Drag &apos;n&apos; drop your House Tree Person drawing here,
                    or click to select files
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {imageSrc && (
        <>
          <div className="mt-8 text-center h-[20vh]">
            <div className="frame">
              <img src={imageSrc} className="h-[10vh]" />
            </div>
          </div>
          <div className="mt-24 container mx-auto">
            <ScrollArea className="h-[calc(100vh-16rem-20vh)]">
              <div className="space-y-4">
                {chats.map((chat, index) => (
                  <ChatBubble
                    key={index}
                    isSelf={chat.isSelf}
                    message={chat.message}
                    receivedAt={chat.receivedAt}
                  />
                ))}
                {isLoading && <div>Loading...</div>}
              </div>
              <div className="pb-16" ref={ref}></div>
            </ScrollArea>
          </div>
          <form
            className="absolute bottom-0 left-0 right-0 p-4 bg-yellow-50 shadow-md"
            onSubmit={onSubmit}
          >
            <div className="container mx-auto flex gap-8">
              <Input
                placeholder={
                  isRecording ? "Recording..." : "Type your response here ..."
                }
                className="rounded-full focus-visible:ring-green-400"
                value={inputText}
                disabled={isRecording}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex gap-2">
                <Button className="rounded-full bg-green-400">
                  <PaperAirplaneIcon className="w-6 h-6" />
                </Button>

                <Button
                  onClick={() => {
                    !isRecording ? start() : stop();
                  }}
                  className={cn("rounded-full", {
                    "bg-red-400": isRecording,
                    "bg-green-400": !isRecording,
                  })}
                >
                  {isRecording ? (
                    <StopIcon className="w-6 h-6" />
                  ) : (
                    <MicrophoneIcon className="w-6 h-6" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </main>
  );
}
