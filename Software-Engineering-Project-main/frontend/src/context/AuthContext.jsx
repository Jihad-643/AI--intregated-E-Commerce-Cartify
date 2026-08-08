import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_URL;

  // Register with Email and Password
  const registerUser = async (name, email, password, phone, imageFile) => {
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Upload image and register in MongoDB
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("uid", userCredential.user.uid);
      formData.append("role", "user");
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Update profile with name and photo URL from response
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: response.data.data.photoURL || null,
      });

      toast.success("Registration successful!");
      return userCredential.user;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  // Login with Email and Password
  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      toast.success("Login successful!");
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Store user in MongoDB
      await axios.post(`${API_URL}/api/auth/social-login`, {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: "user",
        provider: "google",
      });

      toast.success("Google login successful!");
      return result.user;
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed");
      throw error;
    }
  };

  // Login with GitHub
  const loginWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Store user in MongoDB
      await axios.post(`${API_URL}/api/auth/social-login`, {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: "user",
        provider: "github",
      });

      toast.success("GitHub login successful!");
      return result.user;
    } catch (error) {
      console.error("GitHub login error:", error);
      toast.error(error.message || "GitHub login failed");
      throw error;
    }
  };

  // Logout
  const logoutUser = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed");
      throw error;
    }
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    registerUser,
    loginUser,
    loginWithGoogle,
    loginWithGithub,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
