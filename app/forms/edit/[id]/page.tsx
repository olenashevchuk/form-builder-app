"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import FormBuilder from "@/components/form/FormBuilder";
import { Field } from "types";

interface FormData {
  id: string;
  title: string;
  fields: Field[];
}

export default function EditFormPage() {
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForm() {
      try {
        const response = await fetch(`/api/forms/${params.id}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 404) {
            setForm(null);
            return;
          }
          throw new Error("Failed to fetch form");
        }

        const data = await response.json();
        setForm(data);
      } catch (error) {
        console.error("Error fetching form:", error);
        setForm(null);
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (!form) return notFound();

  return (
    <FormBuilder
      formId={form.id}
      initialTitle={form.title}
      initialFields={form.fields}
    />
  );
}
