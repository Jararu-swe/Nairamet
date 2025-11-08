"use client";
import { useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Mail, Lock, User, Eye, EyeOff, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Import the Supabase client
import { useToast } from "@/components/ui/use-toast"; // Assuming you have shadcn/ui toast component
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth?: (user: { email: string; name: string }) => void;
}

type FormAction =
  | { type: "update_field"; field: keyof FormState; value: string }
  | { type: "reset" };

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Use a reducer for cleaner state management
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "update_field":
      return { ...state, [action.field]: action.value };
    case "reset":
      return { email: "", password: "", name: "", confirmPassword: "" };
    default:
      return state;
  }
};

export function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formState, dispatch] = useReducer(formReducer, {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (type: "login" | "signup") => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    if (type === "signup" && formState.password !== formState.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const credentials = {
      email: formState.email,
      password: formState.password,
    };

    try {
      if (type === "signup") {
        const { data, error } = await supabase.auth.signUp({
          ...credentials,
          options: {
            data: {
              full_name: formState.name,
            },
          },
        });

        if (error) throw error;

        toast({
          title: "Check your email",
          description:
            "A confirmation link has been sent to your email address.",
        });
        if (data.user && onAuth) {
          onAuth({
            email: data.user.email || formState.email,
            name:
              (data.user.user_metadata as any)?.full_name ||
              formState.name ||
              (data.user.email || "").split("@")[0],
          });
          // Do not call onClose here - the AuthProvider will close the modal
          // when it processes the Supabase SIGNED_IN event. This ensures the
          // provider still has access to any stored return target.
        }
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword(
          credentials
        );
        if (error) throw error;

        if (data.user) {
          if (onAuth) {
            onAuth({
              email: data.user.email || formState.email,
              name:
                (data.user.user_metadata as any)?.full_name ||
                (data.user.email || "").split("@")[0],
            });
          }
          // Do not call onClose here; AuthProvider will close the modal
          // and perform any redirect once it receives the SIGNED_IN event.
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      toast({
        title: "Authentication failed",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      // Respect any stored return target; Supabase will round-trip back to our app
      // and AuthProvider will perform the final redirect.
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: origin || undefined,
          // Minimal scope; expand if you need profile data beyond email/name
          // scopes: "openid email profile",
        },
      });
      // Redirects to Google; control returns after OAuth completes.
    } catch (err: any) {
      console.error("Google sign-in failed", err);

      const rawMessage = err?.message || String(err) || "Google sign-in failed";
      let friendly = rawMessage;
      if (/provider is not enabled|unsupported provider/i.test(rawMessage)) {
        friendly =
          "Google sign-in is not enabled for this Supabase project. " +
          "Enable the Google provider in Supabase (Auth → Providers), " +
          "configure Google OAuth client ID/secret, and set the callback URL.";
      }

      setError(friendly);
      toast({
        title: "Sign in failed",
        description: friendly,
        variant: "destructive",
      });

      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-emerald-600">
            Welcome to NairaMet
          </CardTitle>
          <CardDescription>
            Access premium FX tools and real-time alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <div className="my-4 flex flex-col gap-2">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <LogIn className="w-4 h-4" />
                Continue with Google
              </Button>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-4 text-center">
                {error}
              </div>
            )}

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formState.email}
                    onChange={(e) =>
                      dispatch({
                        type: "update_field",
                        field: "email",
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={formState.password}
                    onChange={(e) =>
                      dispatch({
                        type: "update_field",
                        field: "password",
                        value: e.target.value,
                      })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleSubmit("login")}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formState.name}
                    onChange={(e) =>
                      dispatch({
                        type: "update_field",
                        field: "name",
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formState.email}
                    onChange={(e) =>
                      dispatch({
                        type: "update_field",
                        field: "email",
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="pl-10 pr-10"
                    value={formState.password}
                    onChange={(e) =>
                      dispatch({
                        type: "update_field",
                        field: "password",
                        value: e.target.value,
                      })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={formState.confirmPassword}
                    onChange={(e) =>
                      dispatch({
                        type: "update_field",
                        field: "confirmPassword",
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleSubmit("signup")}
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Free access to Naira Watch blog</p>
            <p className="text-emerald-600 font-medium">
              Create an account to save preferences and alerts (all features
              remain free)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
