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
  const [phonenumber, setPhonenumber] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCoordinates = async (placeName: string) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      placeName
    )}&limit=1&appid=12f776a2003dd3a8d2bac9996ea7c2b0`;

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
    if (!foodDetails || !location || !phonenumber) {
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
        phonenumber: phonenumber,
        isBooked: false,
      });

      alert("Post created successfully!");
      setFoodDetails("");
      setLocation("");
      setPhonenumber("");

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
        <input
          type="tel"
          placeholder="Enter Phone number"
          value={phonenumber}
          onChange={(e) => setPhonenumber(e.target.value)}
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
