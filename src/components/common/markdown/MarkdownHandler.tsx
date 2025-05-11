import React, { useRef } from "react";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // 👈 Enables raw HTML in markdown
import rehypeHighlight from "rehype-highlight";

// A small wrapper around <pre> to inject a Copy button
const CodeBlockWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const preRef = useRef<HTMLPreElement>(null);

  const copy = async () => {
    if (!preRef.current) return;
    await navigator.clipboard.writeText(preRef.current.innerText);
    toast.success("Kód vágólapra másolva");
  };

  return (
    <div className="relative my-4">
      <button
        onClick={copy}
        className="absolute top-2 right-2 bg-background border-2 text-xs px-2 py-1 rounded hover:cursor-pointer"
        title="Copy to clipboard"
      >
        Copy
      </button>
      <pre
        ref={preRef}
        className="overflow-x-auto border-2 rounded-md font-mono text-sm p-4"
      >
        {children}
      </pre>
    </div>
  );
};

// Tell react-markdown to wrap every <pre><code> in our wrapper
const markdownComponents = {
  pre({ node, children, ...props }: any) {
    return <CodeBlockWrapper {...props}>{children}</CodeBlockWrapper>;
  },
  code({ inline, children, ...props }: any) {
    if (inline) {
      return (
        <code {...props} className="px-1 rounded font-mono text-sm">
          {children}
        </code>
      );
    }
    return <code {...props}>{children}</code>;
  },
  a({ href, children, ...props }: any) {
    return (
      <a
        href={href}
        {...props}
        className="text-blue-600 hover:underline font-medium"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },
};

interface MarkdownHandlerProps {
  content: string;
}

const MarkdownHandler: React.FC<MarkdownHandlerProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]} // 👈 raw HTML support added here
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownHandler;
