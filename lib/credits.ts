import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";

export type CreditReason =
  | "banner_generation"
  | "logo_generation"
  | "site_generation"
  | "image_improvement"
  | "purchase"
  | "bonus"
  | "refund";

export type CreditWallet = {
  plan: "free" | "professional" | "agency";
  credits: number;
  totalReceived: number;
  totalUsed: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const DEFAULT_FREE_CREDITS = 10;

function validAmount(amount: number) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Quantidade de créditos inválida.");
  }
}

export async function ensureCreditWallet(uid: string) {
  const userRef = adminDb.collection("users").doc(uid);

  await adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);

    if (snapshot.exists) return;

    transaction.set(userRef, {
      plan: "free",
      credits: DEFAULT_FREE_CREDITS,
      totalReceived: DEFAULT_FREE_CREDITS,
      totalUsed: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}

export async function getCreditWallet(uid: string) {
  await ensureCreditWallet(uid);

  const snapshot = await adminDb.collection("users").doc(uid).get();
  const data = snapshot.data();

  if (!data) {
    throw new Error("CREDIT_WALLET_NOT_FOUND");
  }

  return {
    plan: (data.plan || "free") as CreditWallet["plan"],
    credits: Number(data.credits || 0),
    totalReceived: Number(data.totalReceived || 0),
    totalUsed: Number(data.totalUsed || 0),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } satisfies CreditWallet;
}

export async function consumeCredits({
  uid,
  amount,
  reason,
  metadata = {},
}: {
  uid: string;
  amount: number;
  reason: CreditReason;
  metadata?: Record<string, unknown>;
}) {
  validAmount(amount);

  const userRef = adminDb.collection("users").doc(uid);
  const usageRef = adminDb.collection("creditTransactions").doc();

  return adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);

    const currentCredits = snapshot.exists
      ? Number(snapshot.data()?.credits || 0)
      : DEFAULT_FREE_CREDITS;

    const currentTotalReceived = snapshot.exists
      ? Number(snapshot.data()?.totalReceived || 0)
      : DEFAULT_FREE_CREDITS;

    const currentTotalUsed = snapshot.exists
      ? Number(snapshot.data()?.totalUsed || 0)
      : 0;

    if (currentCredits < amount) {
      throw new Error("INSUFFICIENT_CREDITS");
    }

    const remainingCredits = currentCredits - amount;

    transaction.set(
      userRef,
      {
        plan: snapshot.exists
          ? snapshot.data()?.plan || "free"
          : "free",
        credits: remainingCredits,
        totalReceived: currentTotalReceived,
        totalUsed: currentTotalUsed + amount,
        createdAt: snapshot.exists
          ? snapshot.data()?.createdAt
          : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    transaction.set(usageRef, {
      uid,
      type: "usage",
      reason,
      amount: -amount,
      balanceAfter: remainingCredits,
      metadata,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { remainingCredits };
  });
}

export async function addCredits({
  uid,
  amount,
  reason,
  metadata = {},
  plan,
}: {
  uid: string;
  amount: number;
  reason: CreditReason;
  metadata?: Record<string, unknown>;
  plan?: CreditWallet["plan"];
}) {
  validAmount(amount);

  const userRef = adminDb.collection("users").doc(uid);
  const transactionRef = adminDb.collection("creditTransactions").doc();

  return adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);

    const currentCredits = snapshot.exists
      ? Number(snapshot.data()?.credits || 0)
      : 0;

    const currentTotalReceived = snapshot.exists
      ? Number(snapshot.data()?.totalReceived || 0)
      : 0;

    const currentTotalUsed = snapshot.exists
      ? Number(snapshot.data()?.totalUsed || 0)
      : 0;

    const currentPlan = snapshot.exists
      ? ((snapshot.data()?.plan || "free") as CreditWallet["plan"])
      : "free";

    const remainingCredits = currentCredits + amount;
    const isRefund = reason === "refund";

    transaction.set(
      userRef,
      {
        plan: plan || currentPlan,
        credits: remainingCredits,
        totalReceived: isRefund
          ? currentTotalReceived
          : currentTotalReceived + amount,
        totalUsed: isRefund
          ? Math.max(0, currentTotalUsed - amount)
          : currentTotalUsed,
        createdAt: snapshot.exists
          ? snapshot.data()?.createdAt
          : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    transaction.set(transactionRef, {
      uid,
      type: isRefund ? "refund" : "credit",
      reason,
      amount,
      balanceAfter: remainingCredits,
      metadata,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { remainingCredits };
  });
}