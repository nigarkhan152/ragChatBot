"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token || !user) {
      router.push("/login");
    }else{
      setUser(user);
      setToken(token);
    } 
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please choose a file first!");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`http://localhost:8000/upload/${user.username}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },      
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");
      if (data.status === "success") {
        setMessage(`✅ Uploaded: ${data.filename || file.name}. ${data.message || ""}`);
      } else {
        setMessage("❌ Upload failed. " + (data.detail || ""));
      }

    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed. Check server logs.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center relative">
      {/* Navigation bar */}
      <div className="w-full max-w-5xl flex justify-between items-center absolute top-12 px-6">
        <div></div> {/* Spacer */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-400  text-center">
          ChatBot File Upload
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-lg transition duration-200"
        >
          Logout
        </button>
      </div>
  
      {/* Upload form */}
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-3xl mt-48 shadow-lg flex flex-col items-center">
        <h2 className="text-3xl font-semibold text-purple-300 mb-6">Upload Document</h2>
  
        <label className="w-full flex items-center justify-center px-6 py-3 mb-4 bg-gray-800 text-gray-300 rounded-xl cursor-pointer hover:bg-gray-700 border border-gray-600 transition duration-200">
          Choose File
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
  
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-white mb-3 shadow-md disabled:opacity-60 transition duration-200"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
  
        {message && (
          <div className="w-full text-center p-3 rounded-lg bg-gray-800 mt-2 text-purple-200">
            {message}
          </div>
        )}
  
        {user && (
          <button
            onClick={() => router.push(`/ask/${user.username}`)}
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl text-white mt-6 shadow-md transition duration-200"
          >
            Go to Ask Page
          </button>
        )}
      </div>
    </div>
  );
  
}
