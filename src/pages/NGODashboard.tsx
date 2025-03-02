import { useEffect, useState } from "react";
import { logout } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import app from "../firebase/firebase"; // Ensure firebase.ts is correctly configured
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore(app);

interface Post {
  id: string;
  userId: string;
  foodDetails: string;
  location: string;
  createdAt: any;
}

const NGODashboard = () => {

  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post))
      );
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">NGO Dashboard</h1>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 border rounded-md shadow-sm">
              <p className="font-semibold">{post.foodDetails}</p>
              <p className="text-gray-500">Location: {post.location}</p>
              <p className="text-sm text-gray-400">
                Posted at {new Date(post.createdAt?.toDate()).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      <button onClick={handleLogout} className="mt-2 p-2 bg-red-500 text-white">
        Logout
      </button>
    </div>
  );
};

export default NGODashboard;
