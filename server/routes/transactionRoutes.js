import express from 'express';
import { 
  getAllTransactions, 
  getTransactionById, 
  getTransactionByReceiptNumber,
  getTransactionsByDateRange,
  createTransaction // Add this import
} from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Route: POST /api/transactions - Create a new transaction
router.post('/', createTransaction);

// Route: GET /api/transactions
router.get('/', getAllTransactions);

// Route: GET /api/transactions/date
router.get('/date', getTransactionsByDateRange);

// Route: GET /api/transactions/receipt/:receiptNumber
router.get('/receipt/:receiptNumber', getTransactionByReceiptNumber);

// Route: GET /api/transactions/:id
router.get('/:id', getTransactionById);

export default router;