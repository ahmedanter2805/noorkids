"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: "CHILD" | "PARENT" | "ADMIN";
  childProfile?: {
    id: string;
    age: number;
    avatar: string;
    xpPoints: number;
    level: number;
    currentStreak: number;
  } | null;
  parentProfile?: {
    id: string;
    phoneNumber?: string;
    children: Array<{
      id: string;
      age: number;
      avatar: string;
      xpPoints: number;
      level: number;
      currentStreak: number;
      user: {
        id: string;
        fullName: string;
        email: string;
      };
    }>;
  } | null;
}

interface AuthContextType {
  user: CurrentUser | null;
  activeChildId: string | null;
  setActiveChildId: (id: string) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (demoType: "ADMIN" | "PARENT" | "CHILD_OMAR" | "CHILD_SARA") => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user.role === "CHILD" && data.user.childProfile) {
          setActiveChildId(data.user.childProfile.id);
        } else if (data.user.role === "PARENT" && data.user.parentProfile?.children?.length) {
          setActiveChildId(data.user.parentProfile.children[0].id);
        }
      } else {
        setUser(null);
        setActiveChildId(null);
      }
    } catch {
      setUser(null);
      setActiveChildId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      setUser(data.user);
      if (data.user.role === "CHILD" && data.user.childProfile) {
        setActiveChildId(data.user.childProfile.id);
        router.push("/child/dashboard");
      } else if (data.user.role === "PARENT") {
        if (data.user.parentProfile?.children?.length) {
          setActiveChildId(data.user.parentProfile.children[0].id);
        }
        router.push("/parent/dashboard");
      } else if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      }
      return { success: true };
    } catch {
      return { success: false, error: "Network error occurred." };
    }
  };

  const loginAsDemo = async (demoType: "ADMIN" | "PARENT" | "CHILD_OMAR" | "CHILD_SARA") => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoType }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        if (data.user.role === "CHILD" && data.user.childProfile) {
          setActiveChildId(data.user.childProfile.id);
          router.push("/child/dashboard");
        } else if (data.user.role === "PARENT") {
          if (data.user.parentProfile?.children?.length) {
            setActiveChildId(data.user.parentProfile.children[0].id);
          }
          router.push("/parent/dashboard");
        } else if (data.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        }
      }
    } catch (e) {
      console.error("Demo login error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setActiveChildId(null);
      router.push("/login");
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeChildId,
        setActiveChildId,
        isLoading,
        login,
        loginAsDemo,
        logout,
        refreshUser: fetchCurrentUser,
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
