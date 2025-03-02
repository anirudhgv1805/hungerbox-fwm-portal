import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUserRole } from "../auth";
import { onAuthStateChanged, User } from "firebase/auth";
import auth from "../auth";
import CreatePost from "../components/CreatePost";

const HungerBoxDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRole = await getUserRole(currentUser.uid);
        setRole(userRole);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      {user && (
        <div>
          <p>Email: {user.email}</p>
          <p>Role: {role}</p>
          <button onClick={handleLogout} className="mt-2 p-2 bg-red-500 text-white">
            Logout
          </button>
          {user ? <CreatePost userId={user.uid} /> : <p>Loading...</p>}
        </div>
      )}
    </div>
  );
};

export default HungerBoxDashboard;
