// src/Components/Auth/Login.jsx
import { useState } from "react";
import API from "../../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting login form:", form);
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      console.log("User data:", res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      console.log("Login successful:", res.data);
      setMsg("Logged in successfully!");
    } catch (err) {
      setMsg(err.response.data.message || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 px-3 py-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-3 py-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Login
        </button>
        {msg && <p className="mt-2 text-sm text-center text-red-600">{msg}</p>}
      </form>
    </div>
  );
}
