"use client";
import { useState ,useEffect} from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };   

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Login failed");

      // ✅ Save token and user in localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      const username = data.user.username;
      alert("Login successful!");
      router.push(`/upload/${username}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/login/google";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ✅ Navigation bar */}
      <div className="w-full flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-700">
        <h1
          // onClick={() => router.push("/")}
          className="text-xl font-bold text-purple-400 cursor-pointer"
        >
          ChatBot
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-purple-300"
          >
            Home
          </button>
          {loggedInUser && (
            <button
              onClick={() => router.push(`/ask/${loggedInUser.username}`)}
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
            >
              Go to Ask
            </button>
          )}
        </div>
      </div>

      {/* ✅ Login form */}
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-purple-400 text-center mb-6">
            Login to Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-black border border-purple-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-black border border-purple-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {/* ✅ Google Button */}
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              <FcGoogle className="w-6 h-6" />
              <span>Continue with Google</span>
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
