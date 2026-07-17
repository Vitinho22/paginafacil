import {
  App,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import {
  Auth,
  getAuth,
} from "firebase-admin/auth";
import {
  Firestore,
  getFirestore,
} from "firebase-admin/firestore";

function normalizeEnv(name: string): string {
  const value = process.env[name]
    ?.trim()
    .replace(/^["']|["']$/g, "")
    .trim();

  if (!value) {
    throw new Error(`FIREBASE_ADMIN_ENV_MISSING:${name}`);
  }

  return value;
}

function normalizePrivateKey(value: string): string {
  const normalized = value
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  if (
    !normalized.includes("-----BEGIN PRIVATE KEY-----") ||
    !normalized.includes("-----END PRIVATE KEY-----")
  ) {
    throw new Error("FIREBASE_ADMIN_PRIVATE_KEY_INVALID");
  }

  return normalized;
}

let cachedApp: App | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

function getAdminApp(): App {
  if (cachedApp) {
    return cachedApp;
  }

  const existingApp = getApps()[0];

  if (existingApp) {
    cachedApp = existingApp;
    return existingApp;
  }

  const projectId = normalizeEnv("FIREBASE_ADMIN_PROJECT_ID");
  const clientEmail = normalizeEnv("FIREBASE_ADMIN_CLIENT_EMAIL");
  const privateKey = normalizePrivateKey(
    normalizeEnv("FIREBASE_ADMIN_PRIVATE_KEY"),
  );

  try {
    cachedApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });

    return cachedApp;
  } catch (error) {
    console.error("[Firebase Admin] Falha ao inicializar:", error);

    throw new Error(
      error instanceof Error
        ? `FIREBASE_ADMIN_INIT_FAILED:${error.message}`
        : "FIREBASE_ADMIN_INIT_FAILED",
    );
  }
}

export function getAdminAuth(): Auth {
  if (!cachedAuth) {
    cachedAuth = getAuth(getAdminApp());
  }

  return cachedAuth;
}

export function getAdminDb(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(getAdminApp());
  }

  return cachedDb;
}

export const adminAuth = new Proxy({} as Auth, {
  get(_target, property, receiver) {
    return Reflect.get(getAdminAuth(), property, receiver);
  },
});

export const adminDb = new Proxy({} as Firestore, {
  get(_target, property, receiver) {
    const db = getAdminDb();
    const value = Reflect.get(db, property, receiver);

    return typeof value === "function" ? value.bind(db) : value;
  },
});