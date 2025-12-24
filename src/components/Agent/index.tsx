"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { sendMessage } from "@/app/actions";
import { SendButton } from "../SendButton";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const LoadingDots = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span className="text-2xl leading-none">{dots}</span>;
};

export const Agent = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;

    const currentMessage = message;
    setMessage("");
    setLoading(true);

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: currentMessage }]);

    try {
      const response = await sendMessage(currentMessage);
      if (response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [message]);

  return (
    <>
      <div
        id="messageList"
        className="flex-1 border bg-gray-950/20 border-gray-900 rounded-md mt-4 p-4 flex flex-col gap-4 overflow-y-auto scrollbar-cyan"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                AI
              </div>
            )}
            <div
              className={`p-3 rounded-lg max-w-[85%] md:max-w-[70%] overflow-hidden ${
                msg.role === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        {...props}
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
            {msg.role === "user" && session?.user?.image && (
              <Image
                src={session.user.image}
                alt="user"
                width={32}
                height={32}
                className="rounded-full w-8 h-8"
              />
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
              AI
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-gray-400 min-w-15 flex items-center h-11.5">
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt="user image"
            width={50}
            height={50}
            className="rounded-full hidden md:block"
          />
        )}
        <form className="w-full relative flex gap-2">
          <textarea
            rows={3}
            placeholder="Digite sua mensagem aqui."
            className="w-full bg-gray-950/20 border border-gray-900 rounded-md p-2 text-white outline-none focus:bg-gray-900 transition-colors px-4 resize-none disabled:opacity-10"
            value={message}
            disabled={loading}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <SendButton onClick={handleSendMessage} loading={loading} />
        </form>
      </div>
    </>
  );
};

export default Agent;
