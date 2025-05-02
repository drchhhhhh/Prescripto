const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  receipt_number: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  total_amount: {
    type: Number,
    required: true
  },
  transaction_date: {
    type: Date,
    default: Date.now
  },
  payment_method: {
    type: String,
    default: 'CASH'
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'TransactionItem'
  }]
}, {
  timestamps: false
});

module.exports = mongoose.model('Transaction', TransactionSchema);