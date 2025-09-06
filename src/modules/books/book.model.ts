import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  publishedYear?: number;
  genre?: string;
  price?: number;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents with null/undefined ISBN
      trim: true,
    },
    publishedYear: {
      type: Number,
      min: 1000,
      max: new Date().getFullYear() + 10,
    },
    genre: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false, // Removes __v field
  }
);

// Create indexes for better performance
BookSchema.index({ title: 1 });
BookSchema.index({ author: 1 });
BookSchema.index({ genre: 1 });
BookSchema.index({ isbn: 1 });

export const Book = mongoose.model<IBook>('Book', BookSchema);
