import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    router.push("/login");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
