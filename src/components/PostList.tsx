import { useState } from "react";
import MapModal from "./MapModal";

interface Post {
  id: string;
  foodDetails: string;
  location: string;
  lat: number;
  lon: number;
  createdAt: { seconds: number };
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Food Posts</h2>
      <ul className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className="bg-gray-200 p-4 rounded-md">
              <p className="font-semibold">{post.foodDetails}</p>
              <p className="text-gray-600">📍 {post.location}</p>
              <p className="text-sm text-gray-500">
                Posted on{" "}
                {new Date(post.createdAt.seconds * 1000).toLocaleString()}
              </p>
              <button
                onClick={() => setSelectedPost(post)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Show on Map
              </button>
            </li>
          ))
        ) : (
          <p>No food posts available.</p>
        )}
      </ul>

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

export default PostList;
