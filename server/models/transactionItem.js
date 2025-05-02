const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionItemSchema = new Schema({
  transaction: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  medicine: {
    type: Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit_price: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('TransactionItem', TransactionItemSchema);