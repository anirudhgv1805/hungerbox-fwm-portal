import { useEffect, useState } from "react";
import MapModal from "./MapModal";
import {
  getUsernameById,
  updatePostBookingStatus,
  listenToPosts,
} from "../services/firestoreService";

interface Post {
  id: string;
  foodDetails: string;
  location: string;
  lat: number;
  lon: number;
  createdAt: { seconds: number };
  phonenumber: string;
  isBooked: boolean;
  userId: string;
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
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

  const handleBooking = async (postId: string) => {
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      const updatedPosts = [...posts];
      const newBookingStatus = !updatedPosts[postIndex].isBooked;
      updatedPosts[postIndex].isBooked = newBookingStatus;
      await updatePostBookingStatus(postId, newBookingStatus);
      setPosts(updatedPosts); // Update the posts state to trigger re-render
      setSelectedPost(null); // Close the modal if open
    }
  };

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
              <p className="text-sm text-gray-500">
                Contact: {post.phonenumber}
              </p>
              <p className="text-sm text-gray-500">
                User: {usernames[post.userId] || "Loading..."}
              </p>
              <button
                onClick={() => setSelectedPost(post)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Show on Map
              </button>
              <button
                onClick={() => handleBooking(post.id)}
                className={`mt-2 px-4 py-2 rounded-md ${
                  post.isBooked ? "bg-red-500" : "bg-blue-500"
                } text-white`}
              >
                {post.isBooked ? "Cancel Booking" : "Book Now"}
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
