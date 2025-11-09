(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/src/app/ask/[username]/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AskPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function AskPage() {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            sender: "bot",
            text: "Hi 👋! Ask me anything about your documents."
        }
    ]);
    const [chatHistory, setChatHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [question, setQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [listening, setListening] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHistory, setShowHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // 👈 toggle state
    const chatEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const recognitionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Load user & token from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AskPage.useEffect": ()=>{
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const storedToken = localStorage.getItem("token");
            if (!storedUser || !storedToken) {
                router.push("/login");
            } else {
                setUser(storedUser);
                setToken(storedToken);
                console.log("User loaded:", storedUser);
            }
        }
    }["AskPage.useEffect"], [
        router
    ]);
    // Auto-scroll to bottom when messages update
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AskPage.useEffect": ()=>{
            var _chatEndRef_current;
            (_chatEndRef_current = chatEndRef.current) === null || _chatEndRef_current === void 0 ? void 0 : _chatEndRef_current.scrollIntoView({
                behavior: "smooth"
            });
        }
    }["AskPage.useEffect"], [
        messages,
        loading
    ]);
    //fetch chat history from backend
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AskPage.useEffect": ()=>{
            if (user && token) {
                fetch("http://localhost:8000/api/chats/".concat(user.username), {
                    headers: {
                        Authorization: "Bearer ".concat(token)
                    }
                }).then({
                    "AskPage.useEffect": (res)=>res.json()
                }["AskPage.useEffect"]).then({
                    "AskPage.useEffect": (data)=>{
                        if (data.chats) {
                            setChatHistory(data.chats);
                        }
                    }
                }["AskPage.useEffect"]).catch({
                    "AskPage.useEffect": (err)=>console.error("Error loading history:", err)
                }["AskPage.useEffect"]);
            }
        }
    }["AskPage.useEffect"], [
        user,
        token
    ]);
    // Load selected chat into main chat window
    const loadChat = (chat)=>{
        const formatted = [
            {
                sender: "user",
                text: chat.question
            },
            {
                sender: "bot",
                text: chat.answer
            }
        ];
        setMessages([
            {
                sender: "bot",
                text: "Hi 👋! Ask me anything about your documents."
            },
            ...formatted
        ]);
        setShowHistory(false); // 👈 hide after selecting chat
    };
    // Initialize SpeechRecognition
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AskPage.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (SpeechRecognition) {
                    const recognition = new SpeechRecognition();
                    recognition.continuous = false;
                    recognition.interimResults = true;
                    recognition.lang = "en-US";
                    recognition.onstart = ({
                        "AskPage.useEffect": ()=>setListening(true)
                    })["AskPage.useEffect"];
                    recognition.onend = ({
                        "AskPage.useEffect": ()=>setListening(false)
                    })["AskPage.useEffect"];
                    recognition.onresult = ({
                        "AskPage.useEffect": (event)=>{
                            let transcript = "";
                            for(let i = event.resultIndex; i < event.results.length; i++){
                                transcript += event.results[i][0].transcript;
                            }
                            setQuestion(transcript);
                        }
                    })["AskPage.useEffect"];
                    recognitionRef.current = recognition;
                }
            }
        }
    }["AskPage.useEffect"], []);
    const handleAsk = async ()=>{
        if (!question.trim() || !user || !token) return;
        setLoading(true);
        const newMessages = [
            ...messages,
            {
                sender: "user",
                text: question
            }
        ];
        setMessages(newMessages);
        try {
            const res = await fetch("http://localhost:8000/ask/".concat(user.username), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer ".concat(token)
                },
                body: JSON.stringify({
                    question,
                    top_k: 3
                })
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error("Fetch failed: ".concat(res.status, " ").concat(errText));
            }
            const data = await res.json();
            setMessages([
                ...newMessages,
                {
                    sender: "bot",
                    text: data.answer || "Sorry, I couldn’t find an answer."
                }
            ]);
            // Add to sidebar history
            setChatHistory((prev)=>[
                    ...prev,
                    {
                        question,
                        answer: data.answer,
                        timestamp: new Date().toISOString()
                    }
                ]);
        } catch (err) {
            console.error(err);
            setMessages([
                ...newMessages,
                {
                    sender: "bot",
                    text: "⚠️ Error: Could not fetch answer."
                }
            ]);
        } finally{
            setLoading(false);
            setQuestion("");
        }
    };
    // Start/Stop voice recognition
    const handleVoiceInput = ()=>{
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
// return (
//   <div className="flex min-h-screen bg-black text-white relative">
//     {/* Sidebar (History) */}
//     {showHistory && (
//       <div className="w-64 bg-gray-900 p-4 border-l border-gray-700 overflow-y-auto absolute right-0 top-0 h-full z-20 shadow-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold text-purple-400">History</h2>
//           <button onClick={() => setShowHistory(false)}>
//             <X className="w-5 h-5 text-purple-400" />
//           </button>
//         </div>
//         <ul className="space-y-2">
//           {chatHistory.map((chat, idx) => (
//             <li
//               key={idx}
//               onClick={() => loadChat(chat)}
//               className="p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 flex items-center space-x-2"
//             >
//               <span>💬</span>
//               <p className="text-sm text-purple-300">Chat {idx + 1}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     )}
//     {/* Main chat area */}
//     <div className="flex-1 flex flex-col items-center justify-center p-6">
//       <div className="w-full relative mb-6">
//         <h1 className="text-5xl text-center font-extrabold text-purple-400 animate-pulse">Chatbot</h1>
//         <button
//           onClick={() => setShowHistory(!showHistory)}
//           className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg flex items-center space-x-2"
//         >
//           <History className="w-5 h-5 text-purple-300" />
//           <span className="text-purple-300">History</span>
//         </button>
//       </div>
//       <div className="w-full max-w-2xl flex flex-col bg-gray-900 rounded-2xl shadow-lg p-6">
//         {/* Chat window */}
//         <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[70vh]">
//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`px-4 py-2 rounded-2xl max-w-xs flex items-center space-x-2 ${
//                   msg.sender === "user"
//                     ? "bg-purple-600 text-white"
//                     : "bg-gray-700 text-purple-200"
//                 }`}
//               >
//                 <span>{msg.sender === "user" ? "🧑" : "🤖"}</span>
//                 <span>{msg.text}</span>
//               </div>
//             </div>
//           ))}
//           {loading && (
//             <div className="flex justify-start">
//               <div className="px-4 py-2 rounded-2xl bg-gray-700 text-purple-200 animate-pulse flex items-center space-x-2">
//                 <span>🤖</span>
//                 <span>Typing…</span>
//               </div>
//             </div>
//           )}
//           <div ref={chatEndRef} />
//         </div>
//         {/* Input box */}
//         <div className="flex items-center space-x-2">
//           <input
//             type="text"
//             className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//             placeholder="Type or speak your question..."
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleAsk()}
//           />
//           <button
//             onClick={handleVoiceInput}
//             className={`p-3 rounded-xl transition ${
//               listening
//                 ? "bg-red-600 hover:bg-red-700"
//                 : "bg-gray-600 hover:bg-gray-700"
//             }`}
//           >
//             {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
//           </button>
//           <button
//             onClick={handleAsk}
//             disabled={loading}
//             className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl disabled:bg-gray-600"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );
}
_s(AskPage, "dfcacqBl5zZ10M+Ji1IyBnNirzA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AskPage;
var _c;
__turbopack_context__.k.register(_c, "AskPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/frontend/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=frontend_2af9d06b._.js.map