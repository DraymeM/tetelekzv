import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/index";

interface AuthContextType {
  isAuthenticated: boolean;
  isSuperUser: boolean;
  userId: number | null;
  username: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isSuperUser: boolean;
    userId: number | null;
    username: string | null;
  }>({
    isAuthenticated: false,
    isSuperUser: false,
    userId: null,
    username: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/auth/check-auth.php");
      if (response.data.authenticated) {
        setAuthState({
          isAuthenticated: true,
          isSuperUser: response.data.superuser,
          userId: response.data.userId,
          username: response.data.username,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isSuperUser: false,
          userId: null,
          username: null,
        });
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setAuthState({
        isAuthenticated: false,
        isSuperUser: false,
        userId: null,
        username: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      await apiClient.post("/auth/login.php", { username, password });
      await checkAuth();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout.php");
      setAuthState({
        isAuthenticated: false,
        isSuperUser: false,
        userId: null,
        username: null,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
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
