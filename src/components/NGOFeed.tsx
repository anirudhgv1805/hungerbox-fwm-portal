import { useEffect, useState } from "react";
import {
  listenToPosts,
  getUsernameById,
  Post,
} from "../services/firestoreService"; // Import Firestore service

const NGOFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const unsubscribe = listenToPosts((newPosts) => {
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

  const availablePosts = posts.filter((post) => !post.isBooked);
  const bookedPosts = posts.filter((post) => post.isBooked);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Available Food Posts</h2>
      {availablePosts.length > 0 ? (
        availablePosts.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow-md my-2">
            <h3 className="font-semibold">{post.foodDetails}</h3>
            <p>
              <strong>Location:</strong> {post.location}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt.seconds * 1000).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Contact:</strong> {post.phonenumber}
            </p>
            <p className="text-sm text-gray-500">
              <strong>User:</strong> {usernames[post.userId] || "Loading..."}
            </p>
          </div>
        ))
      ) : (
        <p>No available posts</p>
      )}

      <h2 className="text-xl font-bold mt-8">Booked Food Posts</h2>
      {bookedPosts.length > 0 ? (
        bookedPosts.map((post) => (
          <div
            key={post.id}
            className="border p-4 rounded shadow-md my-2 bg-gray-200"
          >
            <h3 className="font-semibold">{post.foodDetails}</h3>
            <p>
              <strong>Location:</strong> {post.location}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt.seconds * 1000).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Contact:</strong> {post.phonenumber}
            </p>
            <p className="text-sm text-gray-500">
              <strong>User:</strong> {usernames[post.userId] || "Loading..."}
            </p>
          </div>
        ))
      ) : (
        <p>No booked posts</p>
      )}
    </div>
  );
};

export default NGOFeed;
