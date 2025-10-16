"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Form {
  id: string;
  title: string;
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch("/api/forms");
        const data = await response.json();
        setForms(data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Forms</h1>
        <button
          onClick={() => router.push("/forms/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Form
        </button>
      </div>
      {isLoading ? (
        <p>Loading forms...</p>
      ) : forms.length === 0 ? (
        <p>No published forms available.</p>
      ) : (
        <div className="grid gap-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="p-4 border rounded shadow-sm hover:shadow-md"
            >
              <h2 className="text-lg font-semibold">{form.title}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
