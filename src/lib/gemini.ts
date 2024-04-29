"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { taintUniqueValue } from "next/dist/server/app-render/rsc/taint";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const geminiVisionProModel = genAI.getGenerativeModel({
  model: "gemini-pro-vision",
});

function fileToGenerativePart(fileBase64: string, mimeType: string) {
  return {
    inlineData: {
      data: fileBase64,
      mimeType,
    },
  };
}

export const runP1 = async (drawingBase64: string, mimeType: string) => {
  console.log("running P1");
  const prompt = "What is this?";

  const imageParts = [fileToGenerativePart(drawingBase64, mimeType)];

  const { response } = await geminiVisionProModel.generateContent([
    prompt,
    ...imageParts,
  ]);
  const text = response.text();
  console.log(text);
  console.log("done");
};
