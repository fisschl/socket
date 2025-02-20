import { createOpenAI } from "@ai-sdk/openai";

export const moonshot = createOpenAI({
  apiKey: Deno.env.get("MOONSHOT_API_KEY"),
  baseURL: "https://api.moonshot.cn/v1",
});

export const model = moonshot("kimi-latest");
