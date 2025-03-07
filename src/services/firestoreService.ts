import app from "../firebase/firebase";
import { collection, addDoc, getDocs, query, orderBy, Timestamp, getFirestore, updateDoc, doc, getDoc, onSnapshot } from "firebase/firestore";

const db = getFirestore(app)

export interface Post {
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

export const addPost = async (title: string, description: string, quantity: number, location: string, userId: string,phonenumber : number,isBooked : boolean) => {
  try {
    await addDoc(collection(db, "posts"), {
      title,
      description,
      quantity,
      location,
      timestamp: Timestamp.now(),
      createdBy: userId,
      phonenumber,
      isBooked,
    });
    console.log("Post added successfully!");
  } catch (error) {
    console.error("Error adding post: ", error);
  }
};

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      foodDetails: doc.data().foodDetails,
      location: doc.data().location,
      lat: doc.data().lat,
      lon: doc.data().lon,
      createdAt: doc.data().createdAt,
      phonenumber: doc.data().phonenumber,
      isBooked: doc.data().isBooked,
      userId: doc.data().userId,
    }));
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return [];
  }
};

export const updatePostBookingStatus = async (postId :string, isBooked : boolean) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    isBooked: isBooked,
  });
};

export const getUsernameById = async (userId : string) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    console.log("User found:", userDoc.data());
    return userDoc.data().name;
  } else {
    throw new Error("User not found");
  }
};

export const listenToPosts = (callback: (posts: Post[]) => void) => {
  const postsRef = collection(db, "posts");
  return onSnapshot(postsRef, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Post));
    callback(posts);
  });
};