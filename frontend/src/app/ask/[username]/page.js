"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send ,History,X,Home,LogOut} from "lucide-react"; // 👈 import icons
import { useRouter } from "next/navigation";

export default function AskPage() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋! Ask me anything about your documents." },
  ]);
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // 👈 toggle state
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const router = useRouter();
  // Load user & token from localStorage
  useEffect(()=>{
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    if(!storedUser || !storedToken){
      router.push("/login");
    }else{
      setUser(storedUser);
      setToken(storedToken);
      console.log("User loaded:",storedUser);
    }
  },[router]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  //fetch chat history from backend
  useEffect(() => {
    if (user && token) {
      fetch(`http://localhost:8000/api/chats/${user.username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.chats) {
            setChatHistory(data.chats);
          }
        })
        .catch((err) => console.error("Error loading history:", err));
    }
  }, [user, token]);

  // Load selected chat into main chat window
  const loadChat = (chat) => {
    const formatted = [
      { sender: "user", text: chat.question },
      { sender: "bot", text: chat.answer },
    ];
    setMessages([
      { sender: "bot", text: "Hi 👋! Ask me anything about your documents." },
      ...formatted,
    ]);
    setShowHistory(false); // 👈 hide after selecting chat
  };

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);

        recognition.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setQuestion(transcript);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleAsk = async () => {
    if (!question.trim() || !user || !token) return;
    setLoading(true);

    const newMessages = [...messages, { sender: "user", text: question }];
    setMessages(newMessages);

    try {
      const res = await fetch(`http://localhost:8000/ask/${user.username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },      
        body: JSON.stringify({ question, top_k: 3 }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Fetch failed: ${res.status} ${errText}`);
      }

      const data = await res.json();

      setMessages([
        ...newMessages,
        { sender: "bot", text: data.answer || "Sorry, I couldn’t find an answer." },
      ]);
          // Add to sidebar history
      setChatHistory((prev) => [
        ...prev,
        { question, answer: data.answer, timestamp: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Error: Could not fetch answer." },
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  // Start/Stop voice recognition
  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <div className="flex min-h-screen bg-black text-white relative flex-col">
      {/* 🔹 Top Navigation */}
      <div className="w-full flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-700 shadow-md">
        {/* Left side (Home + Logout) */}
        <div className="flex space-x-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
          >
            <Home className="w-5 h-5 text-purple-300" />
            <span className="text-sm text-purple-300">Home</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
          >
            <LogOut className="w-5 h-5 text-white" />
            <span className="text-sm text-white">Logout</span>
          </button>
        </div>

        {/* Center heading */}
        <h1 className="text-3xl font-extrabold text-purple-400">Chatbot</h1>

        {/* Right side (History toggle) */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
        >
          <History className="w-5 h-5 text-purple-300" />
          <span className="text-sm text-purple-300">History</span>
        </button>
      </div>
   {/* Sidebar (History) */}
       {showHistory && (
        <div className="w-64 bg-gray-900 p-4 border-l border-gray-700 overflow-y-auto absolute right-0 top-0 h-full z-20 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-purple-400">History</h2>
            <button onClick={() => setShowHistory(false)}>
              <X className="w-5 h-5 text-purple-400" />
            </button>
          </div>
          <ul className="space-y-2">
            {chatHistory.map((chat, idx) => (
              <li
                key={idx}
                onClick={() => loadChat(chat)}
                className="p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 flex items-center space-x-2"
              >
                <span>💬</span>
                <p className="text-sm text-purple-300">Chat {idx + 1}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl flex flex-col bg-gray-900 rounded-2xl shadow-lg p-6">
          {/* Chat window */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[70vh]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs flex items-center space-x-2 ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-purple-200"
                  }`}
                >
                  <span>{msg.sender === "user" ? "🧑" : "🤖"}</span>
                  <span>{msg.text}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-gray-700 text-purple-200 animate-pulse flex items-center space-x-2">
                  <span>🤖</span>
                  <span>Typing…</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input box */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Type or speak your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl transition ${
                listening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={handleAsk}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl disabled:bg-gray-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

