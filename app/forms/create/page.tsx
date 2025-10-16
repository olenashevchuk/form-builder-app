"use client";

import Link from "next/link";
import FormBuilder from "@/components/form/FormBuilder";

export default function CreateFormPage() {
  return (
    <div className="min-h-screen p-6 ">
      <Link
        href="/"
        className="inline-block mb-4 text-blue-600 hover:underline"
      >
        ← Back to Home
      </Link>
      <FormBuilder />
    </div>
  );
}
