import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  transactionType: {
    type: String,
    enum: ['purchase', 'restock'],
    required: true
  },
  items: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
});

// Static method to generate receipt number
transactionSchema.statics.generateReceiptNumber = async function(transactionType) {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  // Get count of transactions for today to generate sequential number
  const count = await this.countDocuments({
    createdAt: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999))
    }
  });
  
  // Format: YYMMDD-XXXX where XXXX is sequential number
  // Add prefix based on transaction type: P for purchase, R for restock
  const prefix = transactionType === 'purchase' ? 'P' : 'R';
  return `${prefix}${year}${month}${day}-${(count + 1).toString().padStart(4, '0')}`;
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;