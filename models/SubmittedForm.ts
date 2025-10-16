import mongoose, { Schema, Document } from "mongoose";

export interface SubmittedForm extends Document {
  formId: mongoose.Types.ObjectId;
  submittedFields: Array<{ label: string; value: any }>;
  submittedAt: Date;
  userId?: string;
}

const SubmittedFormSchema: Schema = new Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  submittedFields: [
    {
      label: { type: String, required: true },
      value: { type: Schema.Types.Mixed, required: true },
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: false,
  },
});

export default mongoose.models.SubmittedForm ||
  mongoose.model<SubmittedForm>("SubmittedForm", SubmittedFormSchema);
