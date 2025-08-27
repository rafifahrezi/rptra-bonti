import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const getOrInitDoc = async <T>(
  collectionName: string,
  docId: string,
  defaultData: T
): Promise<T> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as T;
  } else {
    await setDoc(docRef, defaultData);
    return defaultData;
  }
};
