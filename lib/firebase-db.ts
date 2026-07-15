import { Firestore, initializeFirestore } from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase-app";

let dbInstance: Firestore | null = null;

export function getFirebaseDb(): Firestore {
  if (!dbInstance) {
    // long polling evita falhas comuns de WebChannel em hospedagens, proxies e alguns navegadores.
    dbInstance = initializeFirestore(getFirebaseApp(), {
      experimentalAutoDetectLongPolling: true,
    });
  }
  return dbInstance;
}
