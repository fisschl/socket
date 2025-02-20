import type { Socket } from "socket.io";
import type OpenAI from "openai";
import { MoonshotBaseClient } from "./translate.ts";

const NamingPrompt = `
你是一名程序员，你的任务是为一个字段、变量、类、文件或者函数命名。
接下来，我会给你一些描述或提示词，请你根据描述的含义给出对应的命名。
注意：你的命名应该尽量简短而有意义。尽量给出多个备选的命名。多个命名之间用逗号分隔。使用 PascalCase 格式输出
`;

export interface NamingRequest {
  key: string;
  text: string;
  case: string;
}

export const handleVariables = (socket: Socket) => {
  socket.on("variables", async (request: NamingRequest) => {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    messages.push(
      {
        role: "system",
        content: NamingPrompt,
      },
      {
        role: "user",
        content: request.text,
      },
    );
    const stream = await MoonshotBaseClient.chat.completions.create({
      model: "kimi-latest",
      messages,
      stream: true,
    });
    const result = {
      text: "",
    };
    for await (const { choices } of stream) {
      if (!choices.length) continue;
      const [{ delta }] = choices;
      if (!delta.content) continue;
      result.text += delta.content;
      socket.emit(request.key, {
        text: result.text,
      });
    }
    socket.emit(request.key, {
      finished: true,
    });
  });
};
