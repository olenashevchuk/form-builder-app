"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/24/outline";

type Field = {
  type: "text" | "number" | "textarea";
  label: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
};

const SortableField = ({
  field,
  index,
  setSelectedFieldIndex,
  selectedFieldIndex,
}: {
  field: Field;
  index: number;
  setSelectedFieldIndex: (index: number | null) => void;
  selectedFieldIndex: number | null;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: index.toString(),
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    setSelectedFieldIndex(index);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        "mb-4 p-2 rounded bg-gray-50 border border-dashed border-blue-400 cursor-pointer hover:bg-gray-200 "
      }
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div {...listeners} {...attributes} className="mr-2 cursor-move">
          <Bars3Icon className="h-5 w-5 text-gray-500" />
        </div>
        <div className="flex-1">
          <label>
            {field.label || "Unnamed Field"}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "text" ? (
            <input type="text" placeholder={field.placeholder} disabled />
          ) : field.type === "number" ? (
            <input
              type="number"
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
              disabled
            />
          ) : (
            <textarea
              placeholder={field.placeholder}
              rows={field.rows}
              disabled
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default function CreateFormPage() {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const router = useRouter();

  const addField = (type: Field["type"]) => {
    setFields([
      ...fields,
      {
        type,
        label: "",
        placeholder: "",
        required: false,
        ...(type === "text" || type === "textarea"
          ? { minLength: undefined, maxLength: undefined }
          : type === "number"
          ? { min: undefined, max: undefined, step: undefined }
          : {}),
        ...(type === "textarea" ? { rows: 4 } : {}),
      },
    ]);
  };

  const updateField = (index: number, updated: Partial<Field>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updated };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
    if (selectedFieldIndex === index) setSelectedFieldIndex(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id as string);
    const newIndex = parseInt(over.id as string);

    const reorderedFields = Array.from(fields);
    const [movedField] = reorderedFields.splice(oldIndex, 1);
    reorderedFields.splice(newIndex, 0, movedField);
    setFields(reorderedFields);

    if (selectedFieldIndex === oldIndex) {
      setSelectedFieldIndex(newIndex);
    } else if (
      selectedFieldIndex !== null &&
      selectedFieldIndex >= newIndex &&
      selectedFieldIndex < oldIndex
    ) {
      setSelectedFieldIndex(selectedFieldIndex + 1);
    } else if (
      selectedFieldIndex !== null &&
      selectedFieldIndex <= newIndex &&
      selectedFieldIndex > oldIndex
    ) {
      setSelectedFieldIndex(selectedFieldIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!title) {
      setError("Form title is required");
      setIsSubmitting(false);
      return;
    }

    if (fields.length === 0) {
      setError("At least one field is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, fields }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to create form");
      }

      router.push("/forms");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex gap-8 relative">
      <div className="w-1/2 max-w-lg">
        <h3 className="text-2xl font-bold mb-6">Create New Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title">Form Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter form title"
              required
            />
          </div>

          <div className="mb-4">
            <h4>Fields</h4>
            <div className="flex justify-between mb-4">
              <button
                type="button"
                onClick={() => addField("text")}
                className="outlined"
              >
                Add Text Field
              </button>
              <button
                type="button"
                onClick={() => addField("number")}
                className="outlined"
              >
                Add Number Field
              </button>
              <button
                type="button"
                onClick={() => addField("textarea")}
                className="outlined"
              >
                Add Textarea Field
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="outlined"
              onClick={() => setIsPreviewOpen(true)}
              disabled={fields.length === 0}
            >
              Show Preview
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Form"}
            </button>
          </div>
        </form>
      </div>

      <div className="w-1/2 max-w-lg">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((_, index) => index.toString())}
            strategy={verticalListSortingStrategy}
          >
            <h4>{title || "Untitled Form"}</h4>
            {fields.length === 0 ? (
              <p>No fields added yet.</p>
            ) : (
              fields.map((field, index) => (
                <SortableField
                  key={index}
                  field={field}
                  index={index}
                  setSelectedFieldIndex={setSelectedFieldIndex}
                  selectedFieldIndex={selectedFieldIndex}
                />
              ))
            )}
          </SortableContext>
        </DndContext>
      </div>

      {isPreviewOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-30"
            onClick={() => setIsPreviewOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3>{title || "Untitled Form"}</h3>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="outlined"
                >
                  Close
                </button>
              </div>
              <form>
                {fields.map((field, index) => (
                  <div key={index}>
                    <label>
                      {field.label || "Unnamed Field"}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    {field.type === "text" ? (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        required={field.required}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                      />
                    ) : field.type === "number" ? (
                      <input
                        type="number"
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        required={field.required}
                      />
                    ) : (
                      <textarea
                        placeholder={field.placeholder}
                        rows={field.rows}
                        required={field.required}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-end mt-4">
                  <button type="button">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {selectedFieldIndex !== null && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-10"
            onClick={() => setSelectedFieldIndex(null)}
          />
          <div className="fixed right-0 top-0 h-full w-100 bg-white shadow-lg p-4 overflow-y-auto z-20 transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex justify-between items-center mb-4">
              <h3>{fields[selectedFieldIndex].type} Field Settings</h3>
              <button
                onClick={() => setSelectedFieldIndex(null)}
                className="outlined"
              >
                Close
              </button>
            </div>
            <div className="mb-2">
              <label>Label</label>
              <input
                type="text"
                value={fields[selectedFieldIndex].label}
                onChange={(e) =>
                  updateField(selectedFieldIndex, { label: e.target.value })
                }
                placeholder="Enter field label"
                required
              />
            </div>
            <div className="mb-2">
              <label>Placeholder</label>
              <input
                type="text"
                value={fields[selectedFieldIndex].placeholder || ""}
                onChange={(e) =>
                  updateField(selectedFieldIndex, {
                    placeholder: e.target.value,
                  })
                }
                placeholder="Enter placeholder"
              />
            </div>
            <div className="mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={fields[selectedFieldIndex].required}
                  onChange={(e) =>
                    updateField(selectedFieldIndex, {
                      required: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Required
              </label>
            </div>
            {fields[selectedFieldIndex].type === "text" ||
            fields[selectedFieldIndex].type === "textarea" ? (
              <>
                <div className="mb-2">
                  <label>Min Length</label>
                  <input
                    type="number"
                    value={fields[selectedFieldIndex].minLength || ""}
                    onChange={(e) =>
                      updateField(selectedFieldIndex, {
                        minLength: parseInt(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Max Length</label>
                  <input
                    type="number"
                    value={fields[selectedFieldIndex].maxLength || ""}
                    onChange={(e) =>
                      updateField(selectedFieldIndex, {
                        maxLength: parseInt(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
              </>
            ) : fields[selectedFieldIndex].type === "number" ? (
              <>
                <div className="mb-2">
                  <label>Min</label>
                  <input
                    type="number"
                    value={fields[selectedFieldIndex].min || ""}
                    onChange={(e) =>
                      updateField(selectedFieldIndex, {
                        min: parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Max</label>
                  <input
                    type="number"
                    value={fields[selectedFieldIndex].max || ""}
                    onChange={(e) =>
                      updateField(selectedFieldIndex, {
                        max: parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Step</label>
                  <input
                    type="number"
                    value={fields[selectedFieldIndex].step || ""}
                    onChange={(e) =>
                      updateField(selectedFieldIndex, {
                        step: parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
              </>
            ) : null}
            {fields[selectedFieldIndex].type === "textarea" && (
              <div className="mb-2">
                <label>Rows</label>
                <input
                  type="number"
                  value={fields[selectedFieldIndex].rows || ""}
                  onChange={(e) =>
                    updateField(selectedFieldIndex, {
                      rows: parseInt(e.target.value) || undefined,
                    })
                  }
                  min="1"
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => removeField(selectedFieldIndex)}
              className="outlined danger mt-4"
            >
              Remove Field
            </button>
          </div>
        </>
      )}
    </div>
  );
}
