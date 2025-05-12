import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_AUTH_REGISTER, API_AUTH_LOGIN } from "../api/constants";
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

      localStorage.setItem("token", loginData.accessToken); // ✅ FIXED
      localStorage.setItem("user", JSON.stringify(loginData));
      window.dispatchEvent(new Event("userChanged"));

      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Username"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email (must be @stud.noroff.no)"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="venueManager"
            checked={form.venueManager}
            onChange={handleChange}
          />
          Register as Venue Manager
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
