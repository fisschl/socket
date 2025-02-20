import { streamText } from "ai";
import type { Socket } from "socket.io";
import { model } from "../utils/moonshot.ts";

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
    if (!request.text) return;
    const { textStream } = streamText({
      model,
      system: NamingPrompt,
      prompt: request.text,
    });
    const result = { text: "" };
    for await (const textPart of textStream) {
      result.text += textPart;
      socket.emit(request.key, {
        text: result.text,
      });
    }
    socket.emit(request.key, {
      finished: true,
    });
  });
};
