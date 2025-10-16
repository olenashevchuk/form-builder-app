import { Document } from "mongoose";

export interface Field {
  _id: string;
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
  order?: number;
}

export interface User extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}
