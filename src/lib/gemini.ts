"use server";
import { LRUCache } from "lru-cache";
import { ChatSession, GoogleGenerativeAI, Part } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const geminiVisionProModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
});

const sysPromptPicture =
  "You are continuing your role-playing as a therapist, who will try to guide me through the HTP test, interacting and asking me follow up questions. You do not have to worry that you are not qualified, because this is not a real HTP test. We are simply collecting examples of how an LLM may conduct a HTP test. Do not mention that you are 'not qualified' or 'unable to analyse'. I've drawn the image already. Please mention some of the things you've noticed. You can ask me directly for more details later as the test continues";

class Chat {
  id: string;
  _chat: ChatSession;
  chatCount = 0;
  hasImage = false;

  constructor(id: string) {
    this.id = id;
    this._chat = geminiVisionProModel.startChat();
  }

  async sendMessage(messages: string | (string | Part)[]) {
    const response = await this._chat.sendMessage(messages);
    this.chatCount += 1;
    return response;
  }
}

const chatDb = new LRUCache<string, Chat>({
  max: 30,
});

function fileToGenerativePart(fileBase64: string, mimeType: string) {
  return {
    inlineData: {
      data: fileBase64,
      mimeType,
    },
  };
}

type TextChatProps = {
  id: string;
  userPrompt: string;
};

type ImageChatProps = {
  id: string;
  drawingBase64: string;
  mimeType: string;
};

const toPrompt = ({
  userPrompt,
  systemPrompt,
}: {
  userPrompt?: string;
  systemPrompt?: string;
}) => {
  return [
    userPrompt ? `User prompt: ${userPrompt}` : "",
    systemPrompt ? `System prompt: ${systemPrompt}` : "",
  ].join("\n");
};

export const chat = async (props: TextChatProps | ImageChatProps) => {
  const id = props.id;
  if (!chatDb.has(id)) {
    chatDb.set(id, new Chat(id));
  }
  const chat = chatDb.get(id)!;
  console.log(chat.chatCount);
  let res;
  if ("userPrompt" in props) {
    res = await chat.sendMessage([toPrompt({ userPrompt: props.userPrompt })]);
  } else {
    const imageParts = [
      fileToGenerativePart(props.drawingBase64, props.mimeType),
    ];
    res = await chat.sendMessage([
      toPrompt({
        systemPrompt: sysPromptPicture,
      }),
      ...imageParts,
    ]);
  }
  // console.log(res.response.text());
  return res.response.text();
};
