/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiChatAlt2,
  HiX,
  HiPaperAirplane,
  HiSparkles,
  HiOutlineLightBulb,
} from "react-icons/hi";

const SUGGESTIONS = [
  "Show me products under 1000 BDT",
  "Recommend something under 500 BDT",
  "What's popular right now?",
  "Any deals on electronics?",
];

const ChatBot = ({ isOpen: controlledOpen, onOpenToggle }) => {
  const [open, setOpen] = useState(false);
  const isControlled = typeof controlledOpen === "boolean";
  const openState = isControlled ? controlledOpen : open;
  const showFloatingTrigger = !isControlled;
  const toggleOpen = () => {
    if (isControlled) {
      onOpenToggle?.();
    } else {
      setOpen((v) => !v);
    }
  };

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Cartify AI 👋 Tell me your budget or what you're looking for, and I'll recommend products from the shop.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const API_URL = import.meta.env.VITE_URL;

  useEffect(() => {
    if (!openState) return;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, openState, loading]);

  useEffect(() => {
    if (openState) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [openState]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (openState) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [openState]);

  const sendMessage = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;

    const userMsg = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const history = nextMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { data } = await axios.post(`${API_URL}/api/chatbot`, {
        message: trimmed,
        history,
      });

      const reply = data?.data?.reply ?? "Here is what I found.";
      const recommendations = Array.isArray(data?.data?.recommendations)
        ? data.data.recommendations
        : [];

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          recommendations,
        },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't reach the assistant right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Cleared! Ask me anything about Cartify products and I'll recommend a few options.",
      },
    ]);
    setError("");
  };

  const drawerContent = (
    <AnimatePresence>
      {openState && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[1px]"
            onClick={toggleOpen}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[420px] sm:max-w-[90vw] z-[9999] bg-white shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Cartify AI chat"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <HiSparkles className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold leading-tight">Cartify AI</p>
                <p className="text-xs text-white/70 leading-tight">
                  Product recommendations · online
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="hidden sm:inline-flex text-xs px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Clear chat"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={toggleOpen}
                aria-label="Close chat"
                title="Close"
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 flex items-center justify-center transition-colors"
              >
                <HiX className="text-2xl" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-3 bg-gradient-to-b from-gray-50 to-white"
            >
              {messages.map((m, idx) => (
                <MessageBubble key={idx} message={m} />
              ))}

              {loading && <TypingBubble />}

              {messages.length <= 1 && !loading && (
                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <HiOutlineLightBulb className="text-base" /> Try one of
                    these:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && <p className="text-xs text-red-500 px-1">{error}</p>}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-200 p-2.5 bg-white flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for products, e.g. under 1000 BDT…"
                className="flex-1 px-3 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                disabled={loading}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow"
                aria-label="Send"
              >
                <HiPaperAirplane className="text-base -rotate-45 translate-x-[1px]" />
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {showFloatingTrigger && (
        <motion.button
          onClick={toggleOpen}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-5 right-5 z-[9997] w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white shadow-2xl flex items-center justify-center hover:shadow-gray-900/40 transition-shadow sm:right-6"
          aria-label={openState ? "Close chat" : "Open chat"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {openState ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiX className="text-2xl" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiChatAlt2 className="text-2xl" />
              </motion.span>
            )}
          </AnimatePresence>
          {!openState && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </motion.button>
      )}

      {createPortal(drawerContent, document.body)}
    </>
  );
};

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-br-md"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        {message.recommendations && message.recommendations.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.recommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const RecommendationCard = ({ rec }) => {
  return (
    <Link
      to={`/products/${rec.id}`}
      className="block rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-colors p-2.5"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-gray-800 text-sm line-clamp-1">
          {rec.title}
        </p>
        <span className="text-xs font-bold text-gray-800 whitespace-nowrap">
          ৳{Number(rec.price).toLocaleString()}
        </span>
      </div>
      {rec.reason && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rec.reason}</p>
      )}
      <span className="text-[11px] text-gray-700 mt-1 inline-block font-medium underline-offset-2 hover:underline">
        View details →
      </span>
    </Link>
  );
};

const TypingBubble = () => (
  <div className="flex justify-start">
    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3.5 py-2.5 shadow-sm">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" />
      </div>
    </div>
  </div>
);

export default ChatBot;