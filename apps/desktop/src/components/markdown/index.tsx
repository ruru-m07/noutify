import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkGithub, { defaultBuildUrl } from "remark-github";
import { remark } from "remark";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import { components } from "./components";

async function Markdown({
  markdown,
  github,
}: {
  markdown: string;
  github?: string;
}) {
  const mentionRegex = /@(\w+)/g;
  const text = markdown.replace(mentionRegex, "@$1");

  const file = await remark()
    .use(remarkGfm)
    .use(remarkGemoji)
    .use(remarkGithub, {
      buildUrl(values) {
        return values.type === "mention"
          ? `${process.env.NEXT_PUBLIC_APP_URL}/${values.user}/`
          : defaultBuildUrl(values);
      },
      repository: github,
    })
    .process(text);

  const mdSource = file.toString();

  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkGemoji, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          ...components,
        }}
      >
        {mdSource}
      </ReactMarkdown>
    </div>
  );
}

export default Markdown;
