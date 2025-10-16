"use client";

import { notFound } from "next/navigation";
import { Field } from "types";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Modal from "components/ui/Modal";
import Link from "next/link";

interface FormData {
  id: string;
  title: string;
  fields: Field[];
}

export default function ViewFormPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [submittedFields, setSubmittedFields] = useState<
    { label: string; value: any }[]
  >([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await fetch(`/api/forms/${params.id}`);
        if (!res.ok) throw new Error("Form not found");
        const data: FormData = await res.json();
        setFormData(data);
        setSubmittedFields(
          data.fields.map((f) => ({ label: f.label, value: "" }))
        );
      } catch (err) {
        console.error(err);
        notFound();
      }
    }
    fetchForm();
  }, [params.id]);

  const handleChange = (index: number, value: any) => {
    const updated = [...submittedFields];
    updated[index].value = value;
    setSubmittedFields(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formData) return;

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: formData.id, submittedFields }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }
      router.push("/");
      setIsModalOpen(false);
    } catch (error) {
      setMessage("Error submitting form.");
      setIsModalOpen(false);
    }
  };

  if (!formData) {
    return <p>Loading...</p>;
  }

  const sortedFields = [...formData.fields].sort(
    (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)
  );

  return (
    <div className="min-h-screen p-6">
      <Link href="/">← Back to Forms</Link>

      <div className="max-w-md">
        <h2>{formData.title}</h2>
        <form onSubmit={handleSubmit}>
          {sortedFields.map((field, index) => (
            <div key={field._id}>
              <label htmlFor={field._id} className="block mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "text" ? (
                <input
                  id={field._id}
                  type="text"
                  value={submittedFields[index].value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                />
              ) : field.type === "number" ? (
                <input
                  id={field._id}
                  type="number"
                  value={submittedFields[index].value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                />
              ) : (
                <textarea
                  id={field._id}
                  value={submittedFields[index].value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                  rows={field.rows}
                />
              )}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
        {message && <p className="mt-4 text-green-600">{message}</p>}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Submission"
        >
          <div>
            <p>Please review your submission:</p>
            <ul className="my-4">
              {submittedFields.map((field, index) => (
                <li key={index} className="mb-2">
                  <strong>{field.label}:</strong>{" "}
                  {field.value || "Not provided"}
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="danger outlined"
              >
                Cancel
              </button>
              <button onClick={handleConfirmSubmit}>Confirm</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
