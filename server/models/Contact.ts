// models/Contact.ts
import { Schema, model, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  read: boolean;
  replied: boolean;
  repliedAt?: Date;
  createdAt: Date;
}

const contactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
  repliedAt: { type: Date },
}, { timestamps: true });

export const Contact = model<IContact>("Contact", contactSchema);