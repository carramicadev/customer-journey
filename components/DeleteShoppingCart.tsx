// firestoreUtils.ts
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "./FirebaseFrovider";

/**
 * Recursively deletes all documents in a collection and their subcollections
 * @param collectionPath The path to the collection to delete
 * @param batchSize The number of documents to delete in each batch (default: 100)
 */
export const deleteCollection = async (
  collectionPath: string,
  batchSize: number = 100,
): Promise<void> => {
  const collectionRef = collection(firestore, collectionPath);
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);

  // No documents found, nothing to delete
  if (querySnapshot.size === 0) {
    return;
  }

  // Delete documents in a batch
  const batch = writeBatch(firestore);
  querySnapshot.docs.slice(0, batchSize).forEach((document) => {
    batch.delete(document.ref);
  });

  await batch.commit();

  // If we deleted a full batch, there might be more to delete
  if (querySnapshot.size === batchSize) {
    return deleteCollection(collectionPath, batchSize);
  }

  return;
};
