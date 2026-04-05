import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!)
      )
    });
  } catch (err) {
    console.warn("⚠️ Firebase admin not initialized (DEV mode)");
  }
}

export default admin;
