import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface AuthFormInputs {
  email: string;
  password: string;
  name?: string;
}

interface AuthFormProps {
  type: "login" | "sign-up";
  onSubmit: (data: AuthFormInputs) => Promise<void>;
}

interface FieldConfig {
  name: keyof AuthFormInputs;
  label: string;
  type: string;
  showWhen?: (type: AuthFormProps["type"]) => boolean;
  validation?: Record<string, string | object>;
}

const formFieldsConfig: FieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    showWhen: (type) => type === "sign-up",
    validation: {
      required: "Name is required",
      minLength: { value: 2, message: "Name must be at least 2 characters" },
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    validation: {
      required: "Email is required",
      pattern: {
        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: "Invalid email format",
      },
    },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    validation: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    },
  },
];

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInputs>();
  const [error, setError] = useState<string | null>(null);

  const onFormSubmit: SubmitHandler<AuthFormInputs> = async (data) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} style={{ width: "400px" }}>
      {formFieldsConfig
        .filter((field) => !field.showWhen || field.showWhen(type))
        .map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              type={field.type}
              {...register(field.name, field.validation)}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" className="w-full mt-4">
        {type === "login" ? "Log In" : "Sign Up"}
      </button>
    </form>
  );
}
