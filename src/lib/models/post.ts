import mongoose, { type Document } from "mongoose";
import { v4 as uuid } from "uuid";

export interface IPost extends Document {
  user_id: string;
  title: string;
  text: string;
  likes: string[];
  dislikes: string[];
  comments: string[];
  created_at: string;
  updated_at: string;
}

export default mongoose.models.Post ||
  mongoose.model<IPost>(
    "Post",
    new mongoose.Schema<IPost>(
      {
        _id: { type: String, required: true, default: uuid() },
        user_id: { type: String, required: true },
        title: { type: String, required: true },
        text: { type: String, required: true },
        likes: { type: [String], required: true, default: [] },
        dislikes: { type: [String], required: true, default: [] },
        comments: { type: [String], required: true, default: [] },
      } as const,
      {
        _id: false,
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at",
        },
      },
    ),
  );
