import Link from "next/link"
import Markdown, { Components, Options } from "react-markdown"
import React, { memo, ReactFragment } from "react"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { CircleIcon, ExternalLinkIcon, Link2Icon, LinkIcon } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const MemoizedReactMarkdown: React.FC<Options> = memo(
  Markdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
)

export const ChatMarkdown = ({ content }: { content: string }) => {
  return (
    <Markdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      components={{
        pre({ node, ...props }) {
          return <>{props.children}</>
        },
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "")

          return !inline && match ? (
            <div className="w-full overflow-clip">
              <SyntaxHighlighter
                style={dracula}
                wrapLines
                language={match[1]}
                PreTag={"div"}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
        a: ({ href, children }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipContent>Open Link</TooltipContent>
              <TooltipTrigger asChild>
                <Link
                  target="_blank"
                  className="mr-1 inline-flex h-full w-fit translate-y-[1.5px] items-center gap-1 rounded-md border border-blue-300 bg-white px-2 py-0.5 text-xs font-medium text-blue-600 no-underline hover:bg-blue-50"
                  href={href!}
                >
                  <Link2Icon className="size-3.5 shrink-0" />
                  {children}
                  <ExternalLinkIcon className="size-3 shrink-0" />
                </Link>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        ),
        ul: ({ children }) => (
          <ul className="mt-0 max-w-none list-outside">{children}</ul>
        ),
        table: ({ children }) => (
          <Table className="not-prose max-w-none">{children}</Table>
        ),
        thead: ({ children }) => (
          <TableHeader className="not-prose">{children}</TableHeader>
        ),
        tbody: ({ children }) => (
          <TableBody className="not-prose">{children}</TableBody>
        ),
        tr: ({ children }) => (
          <TableRow className="not-prose">{children}</TableRow>
        ),
        th: ({ children }) => (
          <TableHead className="border-r border-stone-200 font-semibold last:border-r-0">
            {children}
          </TableHead>
        ),
        td: ({ children }) => (
          <TableCell className="border-t border-r border-stone-200 align-middle last:border-r-0">
            {children}
          </TableCell>
        ),
        ol: ({ children }) => (
          <ol className="mt-0 max-w-none list-outside">{children}</ol>
        ),
      }}
      className="prose prose-stone prose-2xl prose-p:text-black prose-pre:overflow-x-auto prose-li:list-outside prose-li:text-stone-900 prose-li:marker:text-black relative"
    >
      {content}
    </Markdown>
  )
}
