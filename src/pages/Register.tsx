import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("hungerbox");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, role as "hungerbox" | "ngo");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="hungerbox">HungerBox</option>
          <option value="ngo">NGO</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
