import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_AUTH_REGISTER, API_AUTH_LOGIN, API_PROFILE_BY_NAME } from "../api/constants";
import { headers } from "../api/headers";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    venueManager: false,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const registerRes = await fetch(API_AUTH_REGISTER, {
        method: "POST",
        headers: headers(true),
        body: JSON.stringify(form),
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        throw new Error(registerData.errors?.[0]?.message || "Registration failed");
      }

      const loginRes = await fetch(API_AUTH_LOGIN, {
        method: "POST",
        headers: headers(true),
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginData.errors?.[0]?.message || "Login after registration failed");
      }

      localStorage.setItem("accessToken", loginData.accessToken);

      await fetch(API_PROFILE_BY_NAME(loginData.name), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.accessToken}`,
        },
        body: JSON.stringify({ venueManager: form.venueManager }),
      });

      localStorage.setItem("user", JSON.stringify({
        ...loginData,
        data: {
          ...loginData.data,
          venueManager: form.venueManager,
        },
      }));

      window.dispatchEvent(new Event("userChanged"));
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div
      className="min-h-screen bg-contain bg-repeat bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('/assets/images/Palms-register-login-bg.png')`,
        backgroundColor: "#FFFBDE",
      }}
    >
      <div className="backdrop-blur-md bg-black/30 rounded-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Register</h1>
        {error && <p className="text-red-200 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-white/50 bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          <input
            type="email"
            name="email"
            placeholder="Email (must be @stud.noroff.no)"
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

          <label className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              name="venueManager"
              checked={form.venueManager}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-teal-400"
            />
            Register as Venue Manager
          </label>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-teal-400 to-lime-300 text-white font-semibold hover:brightness-110 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-white">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="underline font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;

