"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

type ButtonComponentProps = React.ComponentProps<typeof Button>;

type RequireAuthButtonProps = Omit<ButtonComponentProps, "onClick"> & {
  href: string;
  children: React.ReactNode;
};

export function RequireAuthButton({
  href,
  children,
  ...btnProps
}: RequireAuthButtonProps) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push(href);
    } else {
      openAuthModal(href);
    }
  };

  return (
    <>
      <Button onClick={handleClick} {...btnProps}>
        {children}
      </Button>
    </>
  );
}

export default RequireAuthButton;
