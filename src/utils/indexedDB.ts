// utils/db.ts
import { openDB } from "idb";

const DB_NAME = "slidesx-db";
const STORE_NAME = "images";

export const getDB = async () => {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveImageToIndexedDB = async (id: string, base64: string) => {
  const db = await getDB();
  await db.put(STORE_NAME, base64, id);
};

export const getImageFromIndexedDB = async (
  id: string
): Promise<string | undefined> => {
  const db = await getDB();
  return await db.get(STORE_NAME, id);
};

export const deleteImageFromIndexedDB = async (id: string) => {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
};

export const clearAllImages = async () => {
  const db = await getDB();
  await db.clear(STORE_NAME);
};
