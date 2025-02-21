import { streamText } from "ai";
import type { Socket } from "socket.io";
import { htmlToMarkdown, parseMarkdown } from "../utils/markdown.ts";
import { model } from "../utils/moonshot.ts";

const TranslatePromptChinese = `
你是一个专职翻译助手，你的唯一任务是将输入文本翻译为中文。请注意：
1. 仅对输入内容做翻译，不进行任何解释、讨论或其他扩展回答。
2. 对于所有代码块、代码片段、专有名词及保持原始格式的内容，请原样保留，不要翻译。
3. 输出结果应仅包含翻译后的文本，不附加任何额外说明。
请直接翻译下方的内容：
`;

const TranslatePromptEnglish = `
You are a dedicated translation assistant. Your sole responsibility is to translate the provided text into English. Please follow these rules:
1. Translate only the given content; do not offer explanations, discussions, or any additional commentary.
2. Preserve all code blocks, code snippets, proper nouns, and any specialized formatted text in their original form.
3. The output should consist strictly of the translated text without any extra information.
Please translate the following content:
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
