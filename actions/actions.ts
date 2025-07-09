import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig"; // Your firebase instance

// Save user responses in Firestore
interface CategoryScores {
  [key: number]: number;
}

export const saveResponsesToDb = async (userId: string, answers: CategoryScores) => {
  console.log("Hello")
  try {
    // Create a new document under a 'userResponses' collection with a unique ID
    const responsesRef = collection(db, "userResponses");

    // Add the response to Firestore
    await addDoc(responsesRef, {
      userId, // Store user ID for reference
      answers,
      timestamp: new Date(),
    });

    console.log("Responses stored successfully!");
  } catch (error) {
    console.error("Error storing responses: ", error);
  }
};

export const getUserResponses = async (userId: string) => {
  try {
    // Create a reference to the 'responses' collection
    const responsesRef = collection(db, "userResponses");

    // Create a query to filter by userId
    const q = query(responsesRef, where("userId", "==", userId));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Process the results
    const responses: any[] = [];
    querySnapshot.forEach((doc : any) => {
      responses.push({ id: doc.id, ...doc.data() });
    });

    return responses; // Return the array of user responses
  } catch (error) {
    console.error("Error retrieving user responses: ", error);
    return []; // Return an empty array on error
  }
};

