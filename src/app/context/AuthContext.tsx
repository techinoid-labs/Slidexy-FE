"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

type User = {
  id: string;
  email: string;
  name?: string;
} | null;

type UserContextType = {
  user: User;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    if (!session?.user?.accessToken) {
      setUser(null);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [session?.user?.accessToken]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
