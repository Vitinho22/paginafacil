import { Auth, getAuth } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase-app";

let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }
  return authInstance;
}
