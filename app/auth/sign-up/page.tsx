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
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up");
      }

      localStorage.setItem("token", result.token);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    }
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
