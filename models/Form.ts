import mongoose, { Schema, Document } from "mongoose";
import { Field } from "types";

interface Form extends Document {
  title: string;
  userId: mongoose.Types.ObjectId;
  fields: Field[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const fieldSchema = new Schema<Field>({
  type: {
    type: String,
    enum: ["text", "number", "textarea"],
    required: true,
  },
  label: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "Label must be at least 1 character long"],
  },
  placeholder: {
    type: String,
    trim: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  minLength: {
    type: Number,
    min: [0, "minLength must be non-negative"],
  },
  maxLength: {
    type: Number,
    min: [0, "maxLength must be non-negative"],
  },
  min: {
    type: Number,
  },
  max: {
    type: Number,
  },
  step: {
    type: Number,
    min: [0, "step must be non-negative"],
  },
  rows: {
    type: Number,
    min: [1, "rows must be at least 1"],
  },
  order: {
    type: Number,
    required: true,
    default: 0,
    min: [0, "order must be non-negative"],
  },
});

const formSchema = new Schema<Form>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Title must be at least 1 character long"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fields: [fieldSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Form || mongoose.model<Form>("Form", formSchema);
