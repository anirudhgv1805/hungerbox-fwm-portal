import { useEffect, useState } from "react";
import { fetchPosts } from "../services/firestoreService"; // Import Firestore service

const NGOFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };
    getPosts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Available Food Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow-md my-2">
            <h3 className="font-semibold">{post.title}</h3>
            <p>{post.description}</p>
            <p>
              <strong>Quantity:</strong> {post.quantity}
            </p>
            <p>
              <strong>Location:</strong> {post.location}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(post.timestamp.seconds * 1000).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default NGOFeed;
