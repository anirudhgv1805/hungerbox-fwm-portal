import { useState } from "react";
import app from "../firebase/firebase"; // Ensure firebase.ts is correctly configured
import { collection, addDoc, Timestamp, getFirestore } from "firebase/firestore";

const db = getFirestore(app);

interface CreatePostProps {
  userId: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ userId }) => {
  const [foodDetails, setFoodDetails] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodDetails || !location) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        userId,
        foodDetails,
        location,
        createdAt: Timestamp.now(),
      });
      alert("Post created successfully!");
      setFoodDetails("");
      setLocation("");
    } catch (error) {
      console.error("Error adding post: ", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold">Create a Food Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          placeholder="Describe the food"
          value={foodDetails}
          onChange={(e) => setFoodDetails(e.target.value)}
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded-md"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          {loading ? "Posting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
