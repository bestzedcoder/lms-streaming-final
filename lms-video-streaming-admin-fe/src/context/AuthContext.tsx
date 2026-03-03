import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { message } from "antd";

interface UserData {
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  login: (data: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res: any = await axiosClient.get("/auth/check-admin");
        setUser(res.data);
      } catch (error: any) {
        message.error(error?.message);
        console.log(error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: UserData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
