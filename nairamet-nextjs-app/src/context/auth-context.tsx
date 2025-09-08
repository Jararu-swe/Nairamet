import { useSession, signIn, signOut } from "next-auth/react";
import React, { createContext, useContext } from "react";

interface AuthContextType {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  loading: boolean;
  signIn: typeof signIn;
  signOut: typeof signOut;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { data: session, status } = useSession();

  const value = {
    user: session?.user || null,
    loading: status === "loading",
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
