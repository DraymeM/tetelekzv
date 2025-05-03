import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/index";

interface AuthContextType {
  isAuthenticated: boolean;
  isSuperUser: boolean;
  userId: number | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isSuperUser: boolean;
    userId: number | null;
  }>({
    isAuthenticated: false,
    isSuperUser: false,
    userId: null
  });

  const checkAuth = async () => {
    try {
      const response = await apiClient.get("/auth/check-auth.php");
      if (response.data.authenticated) {
        setAuthState({
          isAuthenticated: true,
          isSuperUser: response.data.superuser,
          userId: response.data.userId
        });
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        isSuperUser: false,
        userId: null
      });
    }
  };

  const login = async (username: string, password: string) => {
    await apiClient.post("/auth/login.php", { username, password });
    await checkAuth();
  };

  const logout = async () => {
    await apiClient.post("/auth/logout.php");
    setAuthState({
      isAuthenticated: false,
      isSuperUser: false,
      userId: null
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};