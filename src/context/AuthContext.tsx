import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean | false;
  isSuperUser: boolean;
  login: (userId: string, isSuper: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    // Check localStorage on initial load
    const userId = localStorage.getItem("userId");
    const superuser = localStorage.getItem("superuser");

    if (userId) {
      setIsAuthenticated(true);
      setIsSuperUser(superuser === "true");
    }
  }, []);

  const login = (userId: string, isSuper: boolean) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("superuser", isSuper.toString());
    setIsAuthenticated(true);
    setIsSuperUser(isSuper);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("superuser");
    setIsAuthenticated(false);
    setIsSuperUser(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        isSuperUser: isSuperUser,
        login,
        logout,
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
