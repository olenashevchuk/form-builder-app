"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          router.push("/forms");
        } else {
          router.push("/auth/login");
        }
      })
      .catch(() => router.push("/auth/login"));
  }, [router]);

  return <div className="min-h-screen bg-gray-50" />;
}
