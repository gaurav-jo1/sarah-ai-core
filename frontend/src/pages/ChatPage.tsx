import React, { useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: "user" | "ai"; timestamp: Date }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const storedSessionId = localStorage.getItem("session_id");
        const response = await axios.get("http://127.0.0.1:8000/chat/check", {
          params: storedSessionId ? { session_id: storedSessionId } : {},
        });

        const { session_id, history } = response.data;

        if (session_id) {
          localStorage.setItem("session_id", session_id);
        }

        if (history && Array.isArray(history)) {
          const historyMessages = history.map((msg: any, index: number) => ({
            id: `history-${index}-${Date.now()}`,
            text: String(msg.content),
            sender: (msg.role === "ai" ? "ai" : "user") as "user" | "ai",
            timestamp: new Date(),
          }));
          setMessages(historyMessages);
        }
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      }
    };

    fetchHistory();
  }, []);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setInputText("");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: userMessage,
        sender: "user",
        timestamp: new Date(),
      },
    ]);

    setLoading(true);

    try {
      const storedSessionId = localStorage.getItem("session_id");
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: userMessage,
        session_id: storedSessionId || undefined,
      });

      const aiText =
        response.data.response ||
        response.data.message ||
        JSON.stringify(response.data);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: aiText,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble connecting right now.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const hasStarted = messages.length > 0;

  return (
    <div className="flex flex-col h-full relative bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-hidden">
      {/* Header / Brand - Transitions from Center to Top */}
      <div
        className={`absolute w-full flex justify-center transition-all duration-700 ease-in-out z-10 ${
          hasStarted ? "top-4 scale-75" : "top-[40%] -translate-y-1/2 scale-100"
        }`}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-sm tracking-tight">
          Sarah AI
        </h1>
      </div>

      {/* Messages Area - Only visible when started */}
      <div
        className={`flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-4 pt-24 pb-32 transition-opacity duration-500 ${
          hasStarted ? "opacity-100" : "opacity-0"
        }`}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full mb-6 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] lg:max-w-[60%] px-6 py-4 rounded-2xl text-base md:text-lg leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
              }`}
            >
              <ReactMarkdown
                components={{
                  strong: ({ ...props }) => (
                    <span className="font-bold" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc ml-4 space-y-1 my-2" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol
                      className="list-decimal ml-4 space-y-1 my-2"
                      {...props}
                    />
                  ),
                  li: ({ ...props }) => <li className="pl-1" {...props} />,
                  p: ({ ...props }) => (
                    <p className="mb-1 last:mb-0" {...props} />
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex w-full justify-start mb-6">
            <div className="bg-white px-6 py-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-400">
                Thinking
              </span>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Transitions from Center to Bottom */}
      <div
        className={`absolute w-full px-4 transition-all duration-700 ease-in-out ${
          hasStarted ? "bottom-8" : "bottom-[40%] translate-y-1/2"
        }`}
      >
        <div className="max-w-2xl mx-auto relative">
          <form onSubmit={sendMessage} className="relative group">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Sarah anything..."
              className="w-full bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-800 text-lg placeholder:text-slate-400 rounded-full py-4 pl-6 pr-14 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-full opacity-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          {!hasStarted && (
            <p className="text-center text-slate-400 mt-4 text-sm font-medium animate-pulse">
              Start a conversation to see the magic happen
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
