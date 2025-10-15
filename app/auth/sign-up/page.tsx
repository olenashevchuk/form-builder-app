"use client";

import { AuthForm } from "components/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    email: string;
    password: string;
    name?: string;
  }) => {
    const response = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to sign up");
    }

    const { token } = await response.json();
    localStorage.setItem("token", token);
    router.push("/forms");
  };

  return (
    <>
      <AuthForm type="sign-up" onSubmit={handleSubmit} />
      <div className="text-center">
        <p className="text-sm text-gray-600">Already have an account?</p>
        <Link href="/auth/login">Log in</Link>
      </div>
    </>
  );
}
