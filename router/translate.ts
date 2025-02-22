import { streamText } from "ai";
import type { Socket } from "socket.io";
import { htmlToMarkdown, parseMarkdown } from "../utils/markdown.ts";
import { model } from "../utils/moonshot.ts";

const TranslatePromptChinese = `
你是一个专职翻译助手，你的唯一任务是将输入文本翻译为中文。请注意：
1. 仅对输入内容进行翻译，不添加任何额外解释、讨论或说明。
2. 对于所有代码块、代码片段以及特殊格式内容：
   - 仅翻译其中注释的部分，保持代码和专有名词原样不变。
   - 请自动检测代码块的编程语言。如果代码块中已明确标识（例如 \`\`\`js），直接保留；否则请根据代码内容自动判断语言，并在输出时标注在代码块的语言标记中（例如 \`\`\`Python）。
请直接翻译下方的内容：
`;

const TranslatePromptEnglish = `
You are a dedicated translation assistant whose sole task is to translate the provided text into English. Please adhere strictly to the following instructions:
1. Translate only the provided content without adding any extra explanations, commentary, or discussions.
2. For all code blocks, code snippets, and specially formatted content:
   - Translate only the comments within them while leaving the code and proper nouns unchanged.
   - Automatically detect the programming language of each code block. If a code block is already explicitly labeled (e.g., \`\`\`js), retain its label; otherwise, analyze the code to determine the appropriate language and annotate the code block accordingly (e.g., \`\`\`Python).
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
