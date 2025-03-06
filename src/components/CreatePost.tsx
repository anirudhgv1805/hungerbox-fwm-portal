import { useState } from "react";
import app from "../firebase/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore(app);

interface CreatePostProps {
  userId: string;
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ userId, onPostCreated }) => {
  const [foodDetails, setFoodDetails] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCoordinates = async (placeName: string) => {
    const API_KEY = import.meta.env.VITE_MAP_API_KEY;
    console.log(API_KEY);
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      placeName
    )}&limit=1&appid=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length === 0) {
        throw new Error("Location not found");
      }

      return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodDetails || !location) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);

    const coordinates = await fetchCoordinates(location);
    if (!coordinates) {
      alert("Invalid location! Please enter a valid place name.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        userId,
        foodDetails,
        location,
        lat: coordinates.lat,
        lon: coordinates.lon,
        createdAt: Timestamp.now(),
      });

      alert("Post created successfully!");
      setFoodDetails("");
      setLocation("");

      onPostCreated();
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
