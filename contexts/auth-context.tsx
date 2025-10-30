"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/auth-modal";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  tier: "free" | "premium";
  trialEndsAt?: Date;
}

interface AuthContextType {
  user: User | null;
  login: (user: Omit<User, "tier" | "trialEndsAt" | "id">) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isPremium: boolean;
  isOnTrial: boolean;
  upgradeToPremium: () => Promise<void>;
  startTrial: () => Promise<void>;
  openAuthModal: (returnTo?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authReturnTo, setAuthReturnTo] = useState<string | null>(null);
  const authReturnToRef = useRef<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing Supabase session on mount
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Fetch or create user in your database
          try {
            const response = await fetch("/api/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: session.user.email,
                name: session.user.user_metadata?.full_name,
                supabaseId: session.user.id,
              }),
            });

            if (response.ok) {
              const userData = await response.json();
              setUser(userData.user as User);
            } else {
              // Fallback to Supabase user if API fails (e.g., DB not configured)
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: (session.user.user_metadata as any)?.full_name || null,
                tier: "free",
              });
            }
          } catch (e) {
            // Network/Server error fallback
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: (session.user.user_metadata as any)?.full_name || null,
              tier: "free",
            });
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for Supabase auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Supabase auth event:", event);

        if (event === "SIGNED_IN" && session?.user) {
          // User signed in or verified email
          try {
            const response = await fetch("/api/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: session.user.email,
                name: session.user.user_metadata?.full_name,
                supabaseId: session.user.id,
              }),
            });

            if (response.ok) {
              const userData = await response.json();
              setUser(userData.user as User);

              // Redirect to welcome page after email verification
              if (userData.isNewUser) {
                router.push("/welcome");
              }
              // If there was an intended return target, navigate there.
              // Prefer the in-memory ref, otherwise fall back to localStorage
              let target = authReturnToRef.current;
              if (!target) {
                try {
                  target =
                    typeof window !== "undefined"
                      ? window.localStorage.getItem("nairamet:returnTo")
                      : null;
                } catch {
                  target = null;
                }
              }
              if (target) {
                router.push(target);
                setAuthReturnTo(null);
                authReturnToRef.current = null;
                try {
                  if (typeof window !== "undefined") {
                    window.localStorage.removeItem("nairamet:returnTo");
                  }
                } catch {}
              }
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: (session.user.user_metadata as any)?.full_name || null,
                tier: "free",
              });
            }
          } catch (e) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: (session.user.user_metadata as any)?.full_name || null,
              tier: "free",
            });
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          router.push("/");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const login = async (userData: Omit<User, "tier" | "trialEndsAt" | "id">) => {
    try {
      // This is now handled by Supabase in AuthModal
      // But we keep this for backward compatibility
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const user = await response.json();
        setUser(user);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear your backend session
      await fetch("/api/auth/logout", { method: "POST" });

      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const openAuthModal = (returnTo?: string) => {
    if (returnTo) {
      setAuthReturnTo(returnTo);
      // keep ref in sync
      authReturnToRef.current = returnTo;
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("nairamet:returnTo", returnTo);
        }
      } catch {}
    }
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthReturnTo(null);
    authReturnToRef.current = null;
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("nairamet:returnTo");
      }
    } catch {}
  };

  const isPremium = user?.tier === "premium";
  const isOnTrial = user?.trialEndsAt ? new Date() < user.trialEndsAt : false;

  const upgradeToPremium = async () => {
    if (user) {
      try {
        const response = await fetch(`/api/users/${user.id}/upgrade`, {
          method: "POST",
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
        }
      } catch (error) {
        console.error("Failed to upgrade user:", error);
      }
    }
  };

  const startTrial = async () => {
    if (user && user.tier === "free") {
      try {
        const response = await fetch(`/api/users/${user.id}/trial`, {
          method: "POST",
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
        }
      } catch (error) {
        console.error("Failed to start trial:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isPremium: isPremium || isOnTrial,
        isOnTrial,
        upgradeToPremium,
        startTrial,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        onAuth={() => {
          // When AuthModal reports auth, we'll just close the modal.
          // The Supabase auth listener above will populate the user object
          // and handle redirect to any stored returnTo target.
          setAuthModalOpen(false);
        }}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
