"use client";

import { AuthForm } from "components/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (data: { email: string; password: string }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to log in");
    }
    const { token } = await response.json();

    localStorage.setItem("token", token);
    router.push("/forms");
  };

  return (
    <>
      <AuthForm type="login" onSubmit={handleSubmit} />
      <div className="text-center">
        <p className="text-sm text-gray-600">Don&apos;t have an account?</p>
        <Link href="/auth/sign-up">Sign up</Link>
      </div>
    </>
  );
}
