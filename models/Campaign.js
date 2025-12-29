import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Campaign description is required']
  },
  goalAmount: {
    type: Number,
    required: [true, 'Goal amount is required'],
    min: [1, 'Goal amount must be positive']
  },
  raisedAmount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: [true, 'Campaign deadline is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


campaignSchema.virtual('progressPercentage').get(function() {
  return Math.min((this.raisedAmount / this.goalAmount) * 100, 100);
});


campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

export default mongoose.model('Campaign', campaignSchema);