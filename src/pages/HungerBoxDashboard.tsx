import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUserRole } from "../auth";
import { onAuthStateChanged, User } from "firebase/auth";
import auth from "../auth";
import CreatePost from "../components/CreatePost";
import UserInfo from "../components/UserInfo";
import PostList from "../components/PostList";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from "../firebase/firebase";

const db = getFirestore(app);

const HungerBoxDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const postSnapshot = await getDocs(collection(db, "posts"));
    const fetchedPosts = postSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(fetchedPosts);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center bg-white shadow-lg p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">
          HungerBox Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex mt-6 gap-6">
        <div className="w-1/3 bg-white shadow-lg p-6 rounded-lg">
          {user && <UserInfo email={user.email || ""} role={role} />}
          {user && <CreatePost userId={user.uid} onPostCreated={fetchPosts} />}
        </div>

        <div className="w-2/3 bg-white shadow-lg p-6 rounded-lg">
          <PostList posts={posts} />
        </div>
      </div>
    </div>
  );
};

export default HungerBoxDashboard;
