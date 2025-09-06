import { Router } from 'express';
import { BookController } from './book.controller';

const router = Router();

// CRUD Routes
router.post('/', BookController.create);
router.get('/', BookController.getAll);
router.get('/search', BookController.search);
router.get('/genre/:genre', BookController.getByGenre);
router.get('/author/:author', BookController.getByAuthor);
router.get('/:id', BookController.getById);
router.put('/:id', BookController.update);
router.delete('/:id', BookController.delete);

// Additional Routes
router.patch('/:id/stock', BookController.updateStock);

export default router;
