import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { headers } from "../api/headers";
import { API_AUTH_LOGIN } from "../api/constants";
import { saveAuthUser } from "../utils/auth";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(API_AUTH_LOGIN, {
        method: "POST",
        headers: headers(true),
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Login failed");
      }
      saveAuthUser({ token: data.accessToken, user: data });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div
      className="min-h-screen bg-contain bg-repeat bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('https://sdmntpritalynorth.oaiusercontent.com/files/00000000-9ec8-6246-a639-11ecfbee440e/raw?se=2025-05-21T12%3A34%3A52Z&sp=r&sv=2024-08-04&sr=b&scid=174e0997-e434-594c-af6c-210d7f32ff00&skoid=b928fb90-500a-412f-a661-1ece57a7c318&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-21T07%3A53%3A04Z&ske=2025-05-22T07%3A53%3A04Z&sks=b&skv=2024-08-04&sig=SprWX5pbBCLzffgtcfgUdse9z9eCFszM5VhBi9T9Zsw%3D')`,
      }}
    >
      <div className="backdrop-blur-md bg-black/30 rounded-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Login</h1>
        {error && <p className="text-red-200 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          <div className="flex items-center justify-between text-white">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-400" />
              <span>Remember me</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-teal-400 to-lime-300 text-white font-semibold hover:brightness-110 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-white">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="underline font-medium"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;

