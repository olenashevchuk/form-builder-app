import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Field } from "types";

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

  const fieldId = `sortable-field-${index}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4 p-2 rounded bg-gray-50 border border-dashed border-blue-400 cursor-pointer hover:bg-gray-200"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div {...listeners} {...attributes} className="mr-2 cursor-move">
          <Bars3Icon />
        </div>
        <div className="flex-1">
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
              disabled
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
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          ) : (
            <textarea
              id={fieldId}
              placeholder={field.placeholder}
              rows={field.rows}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SortableField;
