import { streamText } from "ai";
import type { Socket } from "socket.io";
import { htmlToMarkdown, parseMarkdown } from "../utils/markdown.ts";
import { model } from "../utils/moonshot.ts";

const TranslatePromptChinese = `
你是一名专业翻译助手。请将以下内容翻译为中文：
`;

const TranslatePromptEnglish = `
You are a professional translation assistant. Please translate the following text into English:
`;

const LanguageOptions: Record<string, string> = {
  zh: TranslatePromptChinese,
  en: TranslatePromptEnglish,
};

export interface TranslateRequest {
  key: string;
  language?: string;
  text: string;
}

export const handleTranslate = (socket: Socket) => {
  socket.on("translation", async (request: TranslateRequest) => {
    const language = request.language || "zh";
    const system = LanguageOptions[language] || TranslatePromptChinese;
    const content = htmlToMarkdown(request.text);
    if (!content) return;
    const { textStream } = streamText({
      model,
      system,
      prompt: content,
    });
    const result = { text: "" };
    for await (const textPart of textStream) {
      result.text += textPart;
      socket.emit(request.key, {
        text: await parseMarkdown(result.text),
      });
    }
    socket.emit(request.key, { finished: true });
  });
};
