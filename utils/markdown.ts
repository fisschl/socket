import rehypeShiki from "@shikijs/rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import { remark } from "remark";
import TurndownService from "turndown";

const BracketsPattern =
  /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;

export const parseMarkdown = async (text: string) => {
  const input = text.replaceAll(
    BracketsPattern,
    (match, codeBlock, squareBracket, roundBracket) => {
      // 匹配代码块是为了避免其内部的代码被替换
      if (codeBlock) return codeBlock;
      // 将 \[ \] 替换成 $$ $$
      if (squareBracket) return `$$${squareBracket}$$`;
      // 将 \( \) 替换成 $ $
      if (roundBracket) return `$${roundBracket}$`;
      return match;
    }
  );
  const file = await remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeShiki, {
      theme: "catppuccin-mocha",
    })
    .use(rehypeStringify)
    .process(input);
  return file.toString();
};

const turndownService = new TurndownService();

export const htmlToMarkdown = (html?: string) => {
  if (!html?.trim()) return "";
  return turndownService.turndown(html);
};
