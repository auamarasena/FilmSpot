import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkStoredUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    checkStoredUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Set header immediately on login for any subsequent API calls in the same session
    api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    navigate("/sign-in");
  };

  const value = {
    user,
    token: user?.token,
    login,
    logout,
    isAuthenticated: !!user, //If user object exists, they are authenticated.
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
