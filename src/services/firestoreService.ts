import app from "../firebase/firebase";
import { collection, addDoc, getDocs, query, orderBy, Timestamp, getFirestore } from "firebase/firestore";

const db = getFirestore(app)

export const addPost = async (title: string, description: string, quantity: number, location: string, userId: string) => {
  try {
    await addDoc(collection(db, "posts"), {
      title,
      description,
      quantity,
      location,
      timestamp: Timestamp.now(),
      createdBy: userId,
    });
    console.log("Post added successfully!");
  } catch (error) {
    console.error("Error adding post: ", error);
  }
};

export const fetchPosts = async () => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return [];  
  }
};
