"use client";

import { IconBadge } from "@/components/ui/icon-badge";
import { Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useCookies } from "next-client-cookies";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

const Logout = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  useEffect(() => {
    if (status !== "loading") {
      if (status !== "authenticated") {
        redirect("/");
      }
    }
  }, []);

  useEffect(() => {
    const tm = setTimeout(() => {
      signOut({
        callbackUrl: "/",
        redirect: true,
      });
    }, 1000);

    return () => {
      clearTimeout(tm);
    };
  }, []);

  return (
    <div className="flex gap-2 p-3 items-center justify-center mt-2 min-w-full h-screen">
      <IconBadge
        variant="info"
        size="lg"
        icon={Loader2}
        className="animate-spin"
      />

      <span className="text-2xl text-zinc-500">Cerrando sesión...</span>
    </div>
  );
};

export default Logout;
