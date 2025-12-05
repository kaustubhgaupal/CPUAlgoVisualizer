import React, { useState, useRef, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your CPU Scheduling assistant. Ask me about FCFS, SJF, Round Robin, or Gantt charts."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      });

      const data = await res.json();
      const botMsg = {
        sender: "bot",
        text: data.answer || "Sorry, I couldn't understand that."
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Error contacting AI server." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg text-xl z-50"
        onClick={() => setOpen(o => !o)}
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border flex flex-col overflow-hidden z-50">
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold text-sm">AI CPU Tutor</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                    msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-800"
                  }`}>
                  {/* Simple text rendering without Markdown to prevent crashes */}
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-slate-400 ml-2">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <input
              className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask a question..."
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md"
              onClick={sendMessage}
              disabled={loading}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}