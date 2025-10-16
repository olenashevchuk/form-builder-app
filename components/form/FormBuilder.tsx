import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Modal from "components/ui/Modal";
import { Field } from "types";
import SortableField from "./SortableField";
import FieldSettings from "./FieldSettings";

interface FormBuilderProps {
  formId?: string;
  initialTitle?: string;
  initialFields?: Field[];
}

export default function FormBuilder({
  formId,
  initialTitle = "",
  initialFields = [],
}: FormBuilderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const router = useRouter();

  const isEditMode = !!formId;

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

    const url = isEditMode ? `/api/forms/${formId}` : "/api/forms";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, fields }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(
          error || `Failed to ${isEditMode ? "update" : "create"} form`
        );
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-8 relative">
      <div className="w-1/2 max-w-lg">
        <h3 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Form" : "Create New Form"}
        </h3>
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
            <h4 className="text-lg font-semibold">Fields</h4>
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
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Form"
                : "Create Form"}
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
            <h4 className="text-xl font-bold mb-4">
              {title || "Untitled Form"}
            </h4>
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

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title || "Untitled Form"}
      >
        <form className="space-y-4">
          {fields.map((field, index) => {
            const fieldId = `preview-field-${index}`;
            return (
              <div key={index}>
                <label
                  htmlFor={fieldId}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label || "Unnamed Field"}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "text" ? (
                  <input
                    id={fieldId}
                    type="text"
                    placeholder={field.placeholder}
                    required={field.required}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                ) : field.type === "number" ? (
                  <input
                    id={fieldId}
                    type="number"
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    required={field.required}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                ) : (
                  <textarea
                    id={fieldId}
                    placeholder={field.placeholder}
                    rows={field.rows}
                    required={field.required}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                )}
              </div>
            );
          })}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {selectedFieldIndex !== null && (
        <FieldSettings
          isOpen={true}
          onClose={() => setSelectedFieldIndex(null)}
          field={fields[selectedFieldIndex]}
          updateField={(updated) => updateField(selectedFieldIndex, updated)}
          removeField={() => removeField(selectedFieldIndex)}
          fieldType={fields[selectedFieldIndex].type}
        />
      )}
    </div>
  );
}
