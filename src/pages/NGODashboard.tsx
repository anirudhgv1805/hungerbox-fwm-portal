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
import { getUsernameById } from "../services/firestoreService";

const db = getFirestore(app);

interface Post {
  id: string;
  userId: string;
  foodDetails: string;
  location: string;
  lat: number;
  lon: number;
  createdAt: any;
  phonenumber: string;
  isBooked: boolean;
}

const NGODashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Post)
      );
      setPosts(newPosts);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsernames = async () => {
      const usernamesMap: { [key: string]: string } = {};
      for (const post of posts) {
        if (!usernames[post.userId]) {
          try {
            const username = await getUsernameById(post.userId);
            usernamesMap[post.userId] = username;
          } catch (error) {
            console.error("Error fetching username:", error);
          }
        }
      }
      setUsernames(usernamesMap);
    };

    fetchUsernames();
  }, [posts]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const availablePosts = posts.filter((post) => !post.isBooked);
  const bookedPosts = posts.filter((post) => post.isBooked);

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
          <>
            <h2 className="text-xl font-bold">Available Food Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePosts.map((post) => (
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
                      {new Date(post.createdAt.seconds * 1000).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Contact:</strong> {post.phonenumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>User:</strong>{" "}
                      {usernames[post.userId] || "Loading..."}
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

            <h2 className="text-xl font-bold mt-8">Booked Food Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-200 shadow-lg rounded-lg p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {post.foodDetails}
                    </h3>
                    <p className="text-gray-600 mt-2">📍 {post.location}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(post.createdAt.seconds * 1000).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Contact:</strong> {post.phonenumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>User:</strong>{" "}
                      {usernames[post.userId] || "Loading..."}
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
          </>
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
