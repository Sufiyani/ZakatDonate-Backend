import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    default: null
  },
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  type: {
    type: String,
    enum: ['Zakat', 'Sadqah', 'Fitra', 'General'],
    required: [true, 'Donation type is required']
  },
  category: {
    type: String,
    enum: ['Food', 'Education', 'Medical', 'General'],
    required: [true, 'Category is required']
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank', 'Online'],
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified'],
    default: 'Pending'
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
});


donationSchema.pre('save', function() {
  if (!this.transactionId) {
    this.transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
});

export default mongoose.model('Donation', donationSchema);