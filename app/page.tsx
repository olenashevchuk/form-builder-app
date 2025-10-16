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
        if (!response.ok) {
          throw new Error("Failed to fetch forms");
        }
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

  const handleFormClick = (id: string) => {
    router.push(`/forms/edit/${id}`);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h2>Forms</h2>
        <button onClick={() => router.push("/forms/create")}>
          Create Form
        </button>
      </div>
      {isLoading ? (
        <p>Loading forms...</p>
      ) : forms.length === 0 ? (
        <p>No published forms available.</p>
      ) : (
        <div className="flex flex-row gap-4 overflow-x-auto">
          {forms.map((form) => (
            <div
              key={form.id}
              className="p-4 border rounded shadow-sm hover:shadow-md cursor-pointer min-w-[200px]"
              onClick={() => handleFormClick(form.id)}
            >
              <h2 className="mb-0">{form.title}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
