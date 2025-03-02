import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { role } = await login(email, password);
      if (role === "hungerbox") {
        navigate("/hungerbox-dashboard");
      } else if (role === "ngo") {
        navigate("/ngo-dashboard");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin}>
        <input className="border p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="p-2 bg-blue-500 text-white">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
