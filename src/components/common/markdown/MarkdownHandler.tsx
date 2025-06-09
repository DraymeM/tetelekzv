import React, { Suspense, useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
const ReactMarkdown = React.lazy(() => import("react-markdown"));
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

// Simplified component props
type MarkdownComponentProps = {
  children?: React.ReactNode;
  node?: any;
  inline?: boolean;
  className?: string;
  href?: string;
  src?: string;
  alt?: string;
};

const markdownComponents: Record<string, React.FC<MarkdownComponentProps>> = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-6 mb-2">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold mt-5 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-medium mt-3 mb-1">{children}</h4>
  ),
  table: ({ children }) => (
    <table className="table-auto border-collapse border border-border my-4">
      {children}
    </table>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted text-left">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-border px-3 py-2">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2">{children}</td>
  ),
  img: ({ src, alt, ...props }) => (
    <img src={src} alt={alt} loading="lazy" {...props} />
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside my-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside my-2">{children}</ol>
  ),
  li: ({ children }) => <li className="mb-1">{children}</li>,
  p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
  hr: () => <hr className="my-6 border-t border-border" />,
  pre: ({ children, ...props }) => (
    <CodeBlockWrapper {...props}>{children}</CodeBlockWrapper>
  ),
  code: ({ inline, children, ...props }) => {
    if (inline) {
      return (
        <code {...props} className="px-1 rounded font-mono text-sm">
          {children}
        </code>
      );
    }
    return <code {...props}>{children}</code>;
  },
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      {...props}
      className="text-blue-700 dark:text-blue-400 hover:underline font-medium"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

interface MarkdownHandlerProps {
  content: string;
}

const MarkdownHandler: React.FC<MarkdownHandlerProps> = ({ content }) => {
  const [plugins, setPlugins] = useState<[any, any, any] | null>(null);

  // Load plugins only when needed
  useEffect(() => {
    if (/```|~~~/.test(content)) {
      Promise.all([
        import("remark-gfm"),
        import("rehype-raw"),
        import("rehype-highlight"),
      ]).then(([gfm, raw, highlight]) => {
        setPlugins([gfm.default, raw.default, highlight.default]);
      });
    } else {
      setPlugins(null);
    }
  }, [content]);

  const allPluginsLoaded =
    plugins &&
    plugins.length === 3 &&
    plugins[0] !== undefined &&
    plugins[1] !== undefined &&
    plugins[2] !== undefined;

  return (
    <Suspense
      fallback={<div className="min-h-[200px]">Markdown betöltése...</div>}
    >
      {allPluginsLoaded ? (
        <ReactMarkdown
          remarkPlugins={[plugins[0]]}
          rehypePlugins={[plugins[1], plugins[2]]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      ) : (
        <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
      )}
    </Suspense>
  );
};

export default MarkdownHandler;
