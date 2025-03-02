import { useEffect, useState } from "react";
import { logout } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import app from "../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import MapModal from "../components/MapModal";

const db = getFirestore(app);

interface Post {
  id: string;
  userId: string;
  foodDetails: string;
  location: string;
  lat: number;
  lon: number;
  createdAt: any;
}

const NGODashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto ">
        <div className="flex justify-between items-center mb-6 shadow-md p-4 bg-white">
          <h1 className="text-2xl font-bold text-gray-800">NGO Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition"
          >
            Logout
          </button>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center">No food posts available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {post.foodDetails}
                  </h3>
                  <p className="text-gray-600 mt-2">📍 {post.location}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(post.createdAt?.toDate()).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition"
                >
                  Show on Map
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPost && (
        <MapModal
          lat={selectedPost.lat}
          lon={selectedPost.lon}
          location={selectedPost.location}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default NGODashboard;
