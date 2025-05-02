const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
  medicine: {
    type: Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { 
    createdAt: false, 
    updatedAt: 'updated_at' 
  }
});

// Compound index to ensure unique medicine-branch combination
InventorySchema.index({ medicine: 1, branch: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', InventorySchema);