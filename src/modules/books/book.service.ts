import { Book, IBook } from './book.model';
import { FilterQuery } from 'mongoose';

export interface IBookFilters {
  title?: string;
  author?: string;
  genre?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  publishedYear?: number;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
}

export class BookService {
  async create(bookData: Partial<IBook>): Promise<IBook> {
    const book = new Book(bookData);
    return await book.save();
  }

  async getAll(
    filters: IBookFilters = {},
    pagination: IPaginationOptions = {}
  ): Promise<{ books: IBook[]; total: number; page: number; limit: number; totalPages: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    // Build filter query
    const filterQuery: FilterQuery<IBook> = {};

    if (filters.title) {
      filterQuery.title = { $regex: filters.title, $options: 'i' };
    }

    if (filters.author) {
      filterQuery.author = { $regex: filters.author, $options: 'i' };
    }

    if (filters.genre) {
      filterQuery.genre = { $regex: filters.genre, $options: 'i' };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filterQuery.price = {};
      if (filters.minPrice !== undefined) {
        filterQuery.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        filterQuery.price.$lte = filters.maxPrice;
      }
    }

    if (filters.minStock !== undefined) {
      filterQuery.stock = { $gte: filters.minStock };
    }

    if (filters.publishedYear) {
      filterQuery.publishedYear = filters.publishedYear;
    }

    // Execute queries
    const [books, total] = await Promise.all([
      Book.find(filterQuery).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Book.countDocuments(filterQuery),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      books,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getById(id: string): Promise<IBook | null> {
    return await Book.findById(id);
  }

  async update(id: string, updateData: Partial<IBook>): Promise<IBook | null> {
    return await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<IBook | null> {
    return await Book.findByIdAndDelete(id);
  }

  async getByIsbn(isbn: string): Promise<IBook | null> {
    return await Book.findOne({ isbn });
  }

  async searchBooks(query: string): Promise<IBook[]> {
    return await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });
  }

  async updateStock(id: string, quantity: number): Promise<IBook | null> {
    return await Book.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true, runValidators: true }
    );
  }

  async getBooksByGenre(genre: string): Promise<IBook[]> {
    return await Book.find({ genre: { $regex: genre, $options: 'i' } }).sort({
      createdAt: -1,
    });
  }

  async getBooksByAuthor(author: string): Promise<IBook[]> {
    return await Book.find({ author: { $regex: author, $options: 'i' } }).sort({
      createdAt: -1,
    });
  }
}
