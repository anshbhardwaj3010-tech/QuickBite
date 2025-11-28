// Firebase Configuration Template
// Replace these placeholder values with your actual Firebase credentials
// Get these from: Firebase Console > Project Settings > General

window.firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Instructions to get Firebase credentials:
// 1. Go to https://console.firebase.google.com/
// 2. Select your project (or create a new one)
// 3. Go to Project Settings (gear icon at top left)
// 4. Copy the config values from the "Web" section
// 5. Paste them into the corresponding fields above
// 6. IMPORTANT: Add this firebase-config.js to .gitignore to keep credentials safe!
// 7. Uncomment the setup steps in index.html if not already done

// Once configured, the app will:
// - Enable user authentication (Sign up / Login)
// - Store user data in Firestore
// - Enable order management
