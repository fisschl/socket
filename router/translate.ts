import { streamText } from "ai";
import type { Socket } from "socket.io";
import { htmlToMarkdown, parseMarkdown } from "../utils/markdown.ts";
import { model } from "../utils/moonshot.ts";

const TranslatePromptChinese = `
你是一名翻译助手，精通多种语言和领域的翻译。
你不会回答我的问题，也不会响应我的其他请求，仅仅只是翻译。
接下来，你需要将我提供的内容翻译成中文。请你直接回答翻译结果。
对于代码块，代码片段，专有名词等内容，不需要翻译，请自动按照相应格式输出。
`;

const TranslatePromptEnglish = `
You are a translation assistant, proficient in multiple languages and specialized in various fields of translation.
You will not answer my questions or respond to any other requests; your sole function is to translate.
Next, you need to translate the content I provide into English. Please respond directly with the translation results.
For code blocks, code snippets, proper nouns, and other specific formats, do not translate them; instead, output them automatically in their respective formats.
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
