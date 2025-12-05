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
  justSignedUp: boolean;
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
  const [justSignedUp, setJustSignedUp] = useState(false);
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
              
              // Check if there's a stored return path (from before OAuth redirect)
              try {
                if (typeof window !== "undefined") {
                  const returnPath = window.localStorage.getItem("nairamet:returnTo");
                  const currentPath = window.location.pathname;
                  console.log("[Auth] Init - checking for return path:", returnPath, "current:", currentPath);
                  
                  if (returnPath && returnPath !== "/" && returnPath !== currentPath) {
                    console.log("[Auth] Init - redirecting to stored path:", returnPath);
                    window.localStorage.removeItem("nairamet:returnTo");
                    // Use window.location for more reliable redirect after OAuth
                    window.location.href = returnPath;
                    return; // Exit early to prevent further processing
                  } else if (returnPath) {
                    console.log("[Auth] Init - already on target page, clearing stored path");
                    window.localStorage.removeItem("nairamet:returnTo");
                  }
                }
              } catch {}
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

          // Persisted first-time welcome state across reloads
          try {
            if (typeof window !== "undefined") {
              const v = window.localStorage.getItem("nairamet:justSignedUp");
              if (v === "true") setJustSignedUp(true);
            }
          } catch {}
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

              // Check if there was an intended return target
              let target = authReturnToRef.current;
              console.log("[Auth] After sign in - ref target:", target);
              
              if (!target) {
                try {
                  target =
                    typeof window !== "undefined"
                      ? window.localStorage.getItem("nairamet:returnTo")
                      : null;
                  console.log("[Auth] After sign in - localStorage target:", target);
                } catch {
                  target = null;
                }
              }

              // If there's a return target, go there instead of welcome page
              if (target) {
                console.log("[Auth] Redirecting to return target:", target);
                router.push(target);
                setAuthReturnTo(null);
                authReturnToRef.current = null;
                try {
                  if (typeof window !== "undefined") {
                    window.localStorage.removeItem("nairamet:returnTo");
                  }
                } catch {}
              } else if (userData.isNewUser) {
                // Only redirect to welcome page if no return target and user is new
                console.log("[Auth] New user, redirecting to welcome");
                setJustSignedUp(true);
                try {
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem("nairamet:justSignedUp", "true");
                  }
                } catch {}
                router.push("/welcome");
              } else {
                console.log("[Auth] No redirect needed, staying on current page");
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
          setJustSignedUp(false);
          try {
            if (typeof window !== "undefined") {
              window.localStorage.removeItem("nairamet:justSignedUp");
            }
          } catch {}
          router.push("/");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Keep justSignedUp until the user signs out; we persist it via localStorage
  // and clear it only on SIGNED_OUT.

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
    // If no returnTo is provided, use the current page
    const targetPath = returnTo || (typeof window !== "undefined" ? window.location.pathname : null);
    
    console.log("[Auth] Opening auth modal, returnTo:", targetPath);
    
    if (targetPath && targetPath !== "/") {
      setAuthReturnTo(targetPath);
      // keep ref in sync
      authReturnToRef.current = targetPath;
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("nairamet:returnTo", targetPath);
          console.log("[Auth] Stored return path in localStorage:", targetPath);
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
        justSignedUp,
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
          // DON'T clear the return path here - let the auth listener handle it
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
