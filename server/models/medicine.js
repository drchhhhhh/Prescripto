import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  expirationDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for expiration status
medicineSchema.virtual('expirationStatus').get(function() {
  const today = new Date();
  const daysUntilExpiration = Math.ceil((this.expirationDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiration <= 0) return 'expired';
  if (daysUntilExpiration <= 30) return 'expiring-soon';
  return 'valid';
});

// Set the virtuals to true to include them in the JSON output
medicineSchema.set('toJSON', { virtuals: true });
medicineSchema.set('toObject', { virtuals: true });

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;