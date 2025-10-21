import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle } from "lucide-react";

export default function ChatWidget() {
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hey there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg) return;

    setMessages((m) => [...m, { role: "user", content: msg }]);
    setInput("");
    setIsTyping(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    const eventSource = new EventSource(
      `http://localhost:3001/api/chat?message=${encodeURIComponent(msg)}`
    );

    let fullReply = "";

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        setIsTyping(false);
        eventSource.close();
        return;
      }

      try {
        const { token } = JSON.parse(event.data);
        fullReply += token;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = fullReply;
          return updated;
        });
      } catch (err) {
        console.error("⚠️ Stream parse error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("🚨 Stream connection error:", err);
      setIsTyping(false);
      eventSource.close();
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.1 }}
            className="w-[380px] max-w-[90vw] h-[550px] mt-2 rounded-3xl shadow-2xl bg-gradient-to-br from-[#ffffff20] to-[#ffffff05] backdrop-blur-2xl border border-white/20 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-500/60 to-purple-500/60 backdrop-blur-md text-white font-semibold text-lg flex items-center justify-between">
              <span>💬 CozyCabin AI Assistant</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-400/30 scrollbar-track-transparent">
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-md ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                          : "bg-white/80 text-gray-800 backdrop-blur-sm"
                      }`}
                    >
                      {m.content ||
                        (isTyping && i === messages.length - 1 && (
                          <div className="flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 flex items-center border-t border-white/10 bg-white/10 backdrop-blur-xl">
              <input
                className="flex-1 bg-transparent text-gray-800 dark:text-white placeholder-gray-400 border border-white/30 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-2 rounded-full transition-all duration-200 shadow-md active:scale-90"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
