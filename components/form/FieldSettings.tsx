"use client";

import { Field } from "types";

const FieldSettings = ({
  isOpen,
  onClose,
  field,
  updateField,
  removeField,
  fieldType,
}: {
  isOpen: boolean;
  onClose: () => void;
  field: Field;
  updateField: (updated: Partial<Field>) => void;
  removeField: () => void;
  fieldType: string;
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (field.required && !field.label?.trim()) {
      alert("Label is required");
      return;
    }
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-10"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="fixed right-0 top-0 h-full w-100 bg-white shadow-lg p-4 overflow-y-auto z-20 transform transition-transform duration-300 ease-in-out translate-x-0"
      >
        <div className="flex justify-between items-center mb-4">
          <h3>{fieldType} Field Settings</h3>
          <button type="button" onClick={onClose} className="outlined">
            Close
          </button>
        </div>

        <div className="mb-2">
          <label htmlFor="field-label">
            Label
            <span className="text-red-500">*</span>
          </label>
          <input
            id="field-label"
            type="text"
            value={field.label}
            onChange={(e) => updateField({ label: e.target.value })}
            placeholder="Enter field label"
            required
          />
        </div>

        <div className="mb-2">
          <label htmlFor="field-placeholder">Placeholder</label>
          <input
            id="field-placeholder"
            type="text"
            value={field.placeholder || ""}
            onChange={(e) => updateField({ placeholder: e.target.value })}
            placeholder="Enter placeholder"
          />
        </div>

        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField({ required: e.target.checked })}
              className="mr-2"
            />
            Required
          </label>
        </div>

        {(field.type === "text" || field.type === "textarea") && (
          <>
            <div className="mb-2">
              <label htmlFor="field-minlength">Min Length</label>
              <input
                id="field-minlength"
                type="number"
                value={field.minLength || ""}
                onChange={(e) =>
                  updateField({
                    minLength: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
            <div className="mb-2">
              <label htmlFor="field-maxlength">Max Length</label>
              <input
                id="field-maxlength"
                type="number"
                value={field.maxLength || ""}
                onChange={(e) =>
                  updateField({
                    maxLength: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
          </>
        )}

        {field.type === "number" && (
          <>
            <div className="mb-2">
              <label htmlFor="field-min">Min</label>
              <input
                id="field-min"
                type="number"
                value={field.min || ""}
                onChange={(e) =>
                  updateField({ min: parseFloat(e.target.value) || undefined })
                }
              />
            </div>
            <div className="mb-2">
              <label htmlFor="field-max">Max</label>
              <input
                id="field-max"
                type="number"
                value={field.max || ""}
                onChange={(e) =>
                  updateField({ max: parseFloat(e.target.value) || undefined })
                }
              />
            </div>
            <div className="mb-2">
              <label htmlFor="field-step">Step</label>
              <input
                id="field-step"
                type="number"
                value={field.step || ""}
                onChange={(e) =>
                  updateField({ step: parseFloat(e.target.value) || undefined })
                }
              />
            </div>
          </>
        )}

        {field.type === "textarea" && (
          <div className="mb-2">
            <label htmlFor="field-rows">Rows</label>
            <input
              id="field-rows"
              type="number"
              value={field.rows || ""}
              onChange={(e) =>
                updateField({ rows: parseInt(e.target.value) || undefined })
              }
              min="1"
            />
          </div>
        )}

        <button
          type="button"
          onClick={removeField}
          className="danger outlined "
        >
          Remove Field
        </button>

        <button type="submit" className="primary">
          Save
        </button>
      </form>
    </>
  );
};

export default FieldSettings;
