"use client";

import { useTransition } from "react";
import { logoutUser } from "@/actions/auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();       // clear the cookie on server
      router.push("/login");    // redirect to login page
    });
  };

  return (
    <Button onClick={handleLogout} variant="outline" disabled={isPending}>
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
