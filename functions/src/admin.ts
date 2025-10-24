import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

/**
 * Callable Cloud Function to create a custom authentication token for impersonation.
 * Only callable by users with an 'Admin' role.
 */
export const createImpersonationToken = functions.https.onCall(
  async (data, context) => {
    // 1. Authentication and Authorization Check
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const adminUid = context.auth.uid;
    const targetUid = data.targetUid;

    if (!targetUid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with a 'targetUid'."
      );
    }

    try {
      // Verify that the caller is an admin
      const adminUserDoc = await db.collection("users").doc(adminUid).get();
      if (!adminUserDoc.exists || adminUserDoc.data()?.role !== "Admin") {
        throw new functions.https.HttpsError(
          "permission-denied",
          "You must be an admin to perform this action."
        );
      }

      // 2. Create Audit Log
      const expiresAt = new Date(Date.now() + 300 * 1000); // 5-minute expiry
      const auditLog = {
        adminUid,
        targetUid,
        createdAt: new Date(),
        expiresAt,
        action: "impersonate",
      };
      await db.collection("admin_impersonation_logs").add(auditLog);

      // 3. Generate Custom Token
      const customToken = await admin.auth().createCustomToken(targetUid);

      return {token: customToken};
    } catch (error: any) {
      console.error("Error creating impersonation token:", error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        "internal",
        "An unexpected error occurred.",
        error.message
      );
    }
  }
);
