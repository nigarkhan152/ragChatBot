module.exports = [
"[project]/frontend/.next-internal/server/app/ask/[username]/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/frontend/src/app/favicon.ico.mjs { IMAGE => \"[project]/frontend/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/src/app/favicon.ico.mjs { IMAGE => \"[project]/frontend/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/frontend/src/app/layout.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/src/app/layout.js [app-rsc] (ecmascript)"));
}),
"[project]/frontend/src/app/ask/[username]/page.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

// "use client";
// import { useState, useRef, useEffect } from "react";
// import { Mic, MicOff, Send } from "lucide-react"; // 👈 import icons
// import { useRouter } from "next/navigation";
// export default function AskPage() {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hi 👋! Ask me anything about your documents." },
//   ]);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [question, setQuestion] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [listening, setListening] = useState(false);
//   const chatEndRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const router = useRouter();
//   // Load user & token from localStorage
//   useEffect(()=>{
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     const storedToken = localStorage.getItem("token");
//     if(!storedUser || !storedToken){
//       router.push("/login");
//     }else{
//       setUser(storedUser);
//       setToken(storedToken);
//       console.log("User loaded:",storedUser);
//     }
//   },[router]);
//   // Auto-scroll to bottom when messages update
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);
//   //fetch chat history from backend
//   useEffect(() => {
//     if (user && token) {
//       fetch(`http://localhost:8000/api/chats/${user.username}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.chats) {
//             setChatHistory(data.chats);
//           }
//         })
//         .catch((err) => console.error("Error loading history:", err));
//     }
//   }, [user, token]);
//   // Load selected chat into main chat window
//   const loadChat = (chat) => {
//     const formatted = [
//       { sender: "user", text: chat.question },
//       { sender: "bot", text: chat.answer },
//     ];
//     setMessages([
//       { sender: "bot", text: "Hi 👋! Ask me anything about your documents." },
//       ...formatted,
//     ]);
//   };
//   // Initialize SpeechRecognition
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const SpeechRecognition =
//         window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (SpeechRecognition) {
//         const recognition = new SpeechRecognition();
//         recognition.continuous = false;
//         recognition.interimResults = true;
//         recognition.lang = "en-US";
//         recognition.onstart = () => setListening(true);
//         recognition.onend = () => setListening(false);
//         recognition.onresult = (event) => {
//           let transcript = "";
//           for (let i = event.resultIndex; i < event.results.length; i++) {
//             transcript += event.results[i][0].transcript;
//           }
//           setQuestion(transcript);
//         };
//         recognitionRef.current = recognition;
//       }
//     }
//   }, []);
//   const handleAsk = async () => {
//     if (!question.trim() || !user || !token) return;
//     setLoading(true);
//     const newMessages = [...messages, { sender: "user", text: question }];
//     setMessages(newMessages);
//     try {
//       const res = await fetch(`http://localhost:8000/ask/${user.username}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },      
//         body: JSON.stringify({ question, top_k: 3 }),
//       });
//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Fetch failed: ${res.status} ${errText}`);
//       }
//       const data = await res.json();
//       setMessages([
//         ...newMessages,
//         { sender: "bot", text: data.answer || "Sorry, I couldn’t find an answer." },
//       ]);
//           // Add to sidebar history
//       setChatHistory((prev) => [
//         ...prev,
//         { question, answer: data.answer, timestamp: new Date().toISOString() },
//       ]);
//     } catch (err) {
//       console.error(err);
//       setMessages([
//         ...newMessages,
//         { sender: "bot", text: "⚠️ Error: Could not fetch answer." },
//       ]);
//     } finally {
//       setLoading(false);
//       setQuestion("");
//     }
//   };
//   // Start/Stop voice recognition
//   const handleVoiceInput = () => {
//     if (!recognitionRef.current) {
//       alert("Speech recognition not supported in this browser.");
//       return;
//     }
//     if (listening) {
//       recognitionRef.current.stop();
//     } else {
//       recognitionRef.current.start();
//     }
//   };
//   return (
//     <div className="flex min-h-screen bg-black text-white">
//       {/* Sidebar for chat history */}
//       <div className="w-64 bg-gray-900 p-4 border-r border-gray-700 overflow-y-auto">
//         <h2 className="text-lg font-bold text-purple-400 mb-4">History</h2>
//         <ul className="space-y-2">
//           {chatHistory.map((chat, idx) => (
//             <li
//               key={idx}
//               onClick={() => loadChat(chat)}
//               className="p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
//             >
//             <span>💬</span>
//             <p className="text-sm text-purple-300 truncate">Chat {idx + 1}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//       {/* Main chat area */}
//       <div className="flex-1 flex flex-col items-center justify-center p-6">
//         <h1 className="text-3xl font-bold text-purple-400 mb-6">Chatbot</h1>
//         <div className="w-full max-w-2xl flex flex-col bg-gray-900 rounded-2xl shadow-lg p-6">
//           {/* Chat window */}
//           <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[70vh]">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`px-4 py-2 rounded-2xl max-w-xs flex items-center space-x-2 ${
//                     msg.sender === "user"
//                       ? "bg-purple-600 text-white"
//                       : "bg-gray-700 text-purple-200"
//                   }`}
//                 >
//                   <span>
//                     {msg.sender === "user" ? "🧑" : "🤖"}
//                   </span>
//                   <span>{msg.text}</span>
//                 </div>
//               </div>
//             ))}
//             {loading && (
//               <div className="flex justify-start">
//                 <div className="px-4 py-2 rounded-2xl bg-gray-700 text-purple-200 animate-pulse">
//                   Thinking...
//                 </div>
//               </div>
//             )}
//             <div ref={chatEndRef} />
//           </div>
//           {/* Input box */}
//           <div className="flex items-center space-x-2">
//             <input
//               type="text"
//               className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//               placeholder="Type or speak your question..."
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleAsk()}
//             />
//             <button
//               onClick={handleVoiceInput}
//               className={`p-3 rounded-xl transition ${
//                 listening
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-gray-600 hover:bg-gray-700"
//               }`}
//             >
//               {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
//             </button>
//             <button
//               onClick={handleAsk}
//               disabled={loading}
//               className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl disabled:bg-gray-600"
//             >
//               <Send className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
}),
"[project]/frontend/src/app/ask/[username]/page.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/src/app/ask/[username]/page.js [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__91e39b72._.js.map