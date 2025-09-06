import { Request, Response } from 'express';
import { BookService, IBookFilters, IPaginationOptions } from './book.service';
import { bookIdSchema, createBookSchema, updateBookSchema } from './book.validation';
import { failure, success } from '../../utils/response';
import logger from '../../utils/logger';

const bookService = new BookService();

export class BookController {
  // Create a new book
  static async create(req: Request, res: Response) {
    try {
      // Validate request body
      const { error, value } = createBookSchema.validate(req.body);
      if (error) {
        return res.status(400).json(failure(error.details[0].message, 400));
      }

      // Check if book with same ISBN already exists
      if (value.isbn) {
        const existingBook = await bookService.getByIsbn(value.isbn);
        if (existingBook) {
          return res.status(409).json(failure('Book with this ISBN already exists', 409));
        }
      }

      const book = await bookService.create(value);
      logger.info(`Book created successfully: ${book.id}`);

      return res.status(201).json(success(book, 'Book created successfully'));
    } catch (error) {
      logger.error('Error in create book controller:', error);
      return res.status(500).json(failure('Failed to create book', 500));
    }
  }

  // Get all books with filtering and pagination
  static async getAll(req: Request, res: Response) {
    try {
      const filters: IBookFilters = {
        title: req.query.title as string,
        author: req.query.author as string,
        genre: req.query.genre as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        minStock: req.query.minStock ? Number(req.query.minStock) : undefined,
        publishedYear: req.query.publishedYear ? Number(req.query.publishedYear) : undefined,
      };

      const pagination: IPaginationOptions = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const result = await bookService.getAll(filters, pagination);

      return res.json(success(result, 'Books retrieved successfully'));
    } catch (error) {
      logger.error('Error in getAll books controller:', error);
      return res.status(500).json(failure('Failed to retrieve books', 500));
    }
  }

  // Get book by ID
  static async getById(req: Request, res: Response) {
    try {
      // Validate book ID
      const { error } = bookIdSchema.validate({ id: req.params.id });
      if (error) {
        return res.status(400).json(failure(error.details[0].message, 400));
      }

      const book = await bookService.getById(req.params.id);
      if (!book) {
        return res.status(404).json(failure('Book not found', 404));
      }

      return res.json(success(book, 'Book retrieved successfully'));
    } catch (error) {
      logger.error('Error in getById book controller:', error);
      return res.status(500).json(failure('Failed to retrieve book', 500));
    }
  }

  // Update book
  static async update(req: Request, res: Response) {
    try {
      // Validate book ID
      const { error: idError } = bookIdSchema.validate({ id: req.params.id });
      if (idError) {
        return res.status(400).json(failure(idError.details[0].message, 400));
      }

      // Validate request body
      const { error, value } = updateBookSchema.validate(req.body);
      if (error) {
        return res.status(400).json(failure(error.details[0].message, 400));
      }

      // Check if book exists
      const existingBook = await bookService.getById(req.params.id);
      if (!existingBook) {
        return res.status(404).json(failure('Book not found', 404));
      }

      // Check ISBN uniqueness if updating ISBN
      if (value.isbn && value.isbn !== existingBook.isbn) {
        const bookWithSameIsbn = await bookService.getByIsbn(value.isbn);
        if (bookWithSameIsbn) {
          return res.status(409).json(failure('Book with this ISBN already exists', 409));
        }
      }

      const updatedBook = await bookService.update(req.params.id, value);
      logger.info(`Book updated successfully: ${req.params.id}`);

      return res.json(success(updatedBook, 'Book updated successfully'));
    } catch (error) {
      logger.error('Error in update book controller:', error);
      return res.status(500).json(failure('Failed to update book', 500));
    }
  }

  // Delete book
  static async delete(req: Request, res: Response) {
    try {
      // Validate book ID
      const { error } = bookIdSchema.validate({ id: req.params.id });
      if (error) {
        return res.status(400).json(failure(error.details[0].message, 400));
      }

      const deletedBook = await bookService.delete(req.params.id);
      if (!deletedBook) {
        return res.status(404).json(failure('Book not found', 404));
      }

      logger.info(`Book deleted successfully: ${req.params.id}`);
      return res.json(success(null, 'Book deleted successfully'));
    } catch (error) {
      logger.error('Error in delete book controller:', error);
      return res.status(500).json(failure('Failed to delete book', 500));
    }
  }

  // Search books
  static async search(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json(failure('Search query is required', 400));
      }

      const books = await bookService.searchBooks(query);
      return res.json(success(books, 'Search completed successfully'));
    } catch (error) {
      logger.error('Error in search books controller:', error);
      return res.status(500).json(failure('Failed to search books', 500));
    }
  }

  // Get books by genre
  static async getByGenre(req: Request, res: Response) {
    try {
      const genre = req.params.genre;
      if (!genre) {
        return res.status(400).json(failure('Genre is required', 400));
      }

      const books = await bookService.getBooksByGenre(genre);
      return res.json(success(books, `Books in ${genre} genre retrieved successfully`));
    } catch (error) {
      logger.error('Error in getByGenre books controller:', error);
      return res.status(500).json(failure('Failed to retrieve books by genre', 500));
    }
  }

  // Get books by author
  static async getByAuthor(req: Request, res: Response) {
    try {
      const author = req.params.author;
      if (!author) {
        return res.status(400).json(failure('Author is required', 400));
      }

      const books = await bookService.getBooksByAuthor(author);
      return res.json(success(books, `Books by ${author} retrieved successfully`));
    } catch (error) {
      logger.error('Error in getByAuthor books controller:', error);
      return res.status(500).json(failure('Failed to retrieve books by author', 500));
    }
  }

  // Update book stock
  static async updateStock(req: Request, res: Response) {
    try {
      // Validate book ID
      const { error: idError } = bookIdSchema.validate({ id: req.params.id });
      if (idError) {
        return res.status(400).json(failure(idError.details[0].message, 400));
      }

      const { quantity } = req.body;
      if (typeof quantity !== 'number') {
        return res.status(400).json(failure('Quantity must be a number', 400));
      }

      const book = await bookService.updateStock(req.params.id, quantity);
      if (!book) {
        return res.status(404).json(failure('Book not found', 404));
      }

      logger.info(`Book stock updated: ${req.params.id}, quantity: ${quantity}`);
      return res.json(success(book, 'Book stock updated successfully'));
    } catch (error) {
      logger.error('Error in updateStock book controller:', error);
      return res.status(500).json(failure('Failed to update book stock', 500));
    }
  }
}
