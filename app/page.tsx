"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";

interface Form {
  id: string;
  title: string;
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        jwtDecode(token);
        setIsTokenValid(true);
      } catch {
        setIsTokenValid(false);
      }
    }
  }, []);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch("/api/forms");
        if (!response.ok) throw new Error("Failed to fetch forms");
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

  const handleFormEditClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    router.push(`/forms/edit/${id}`);
  };

  const handleFormViewClick = (id: string) => {
    router.push(`/forms/${id}`);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    await fetch("/api/auth/logout");
    router.push("/");
    setIsTokenValid(false);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex gap-4 items-center mb-6">
        <h2 className="mr-auto">Forms</h2>
        {isTokenValid && (
          <button className="outlined" onClick={logout}>
            Logout
          </button>
        )}
        <button onClick={() => router.push("/forms/create")}>
          Create Form
        </button>
      </div>
      {isLoading ? (
        <p>Loading forms...</p>
      ) : forms.length === 0 ? (
        <p>No published forms available.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {forms.map((form) => (
            <div
              onClick={() => handleFormViewClick(form.id)}
              key={form.id}
              className="p-4 border rounded shadow-sm hover:shadow-md cursor-pointer flex gap-4 justify-between min-h-[100px]"
            >
              <h3 className="line-clamp-3">{form.title}</h3>
              <div className="flex justify-end">
                <PencilSquareIcon
                  className="h-5 w-5 text-gray-500 hover:text-gray-700"
                  onClick={(e) => handleFormEditClick(e, form.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
