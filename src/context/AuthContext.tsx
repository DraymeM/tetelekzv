import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/index";
import RateLimit from "../components/RateLimit"; // your rate‐limit UI
import Spinner from "@/components/Spinner";

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
const RATE_LIMIT_WINDOW_SEC = 600;
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isSuperUser: false,
    userId: null as number | null,
    username: null as string | null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);

  // Install interceptor once
  useEffect(() => {
    const interceptorId = apiClient.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 429) {
          setRateLimited(true);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      apiClient.interceptors.response.eject(interceptorId);
    };
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const resp = await apiClient.get("/auth/check-auth.php");
      if (resp.data.authenticated) {
        setAuthState({
          isAuthenticated: true,
          isSuperUser: resp.data.superuser,
          userId: resp.data.userId,
          username: resp.data.username,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isSuperUser: false,
          userId: null,
          username: null,
        });
      }
    } catch (e) {
      console.error("Auth check error", e);
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
    } catch (e) {
      console.error("Login error", e);
      throw e;
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
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  if (rateLimited) {
    return <RateLimit />;
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

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
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be inside AuthProvider");
  }
  return ctx;
};
