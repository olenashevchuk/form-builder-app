"use client";

import Link from "next/link";
import FormBuilder from "@/components/form/FormBuilder";

export default function CreateFormPage() {
  return (
    <div className="min-h-screen p-6 ">
      <Link href="/">← Back to Forms</Link>
      <FormBuilder />
    </div>
  );
}
