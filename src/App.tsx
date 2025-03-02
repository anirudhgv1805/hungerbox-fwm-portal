import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import auth, { getUserRole } from "./auth";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HungerBoxDashboard from "./pages/HungerBoxDashboard";
import NGODashboard from "./pages/NGODashboard";

function App() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRole = await getUserRole(user.uid);
        setRole(userRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={role ? (role === "hungerbox" ? "/hungerbox-dashboard" : "/ngo-dashboard") : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hungerbox-dashboard" element={role === "hungerbox" ? <HungerBoxDashboard /> : <Navigate to="/login" />} />
        <Route path="/ngo-dashboard" element={role === "ngo" ? <NGODashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
