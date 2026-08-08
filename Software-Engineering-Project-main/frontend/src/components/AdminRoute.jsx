import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_URL}/api/auth/user/${user.uid}`,
          );
          setUserRole(response.data.data.role);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        }
      }
      setCheckingRole(false);
    };

    if (!loading) {
      checkUserRole();
    }
  }, [user, loading]);

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
