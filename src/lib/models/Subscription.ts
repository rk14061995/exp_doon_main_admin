import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  email: string;
  isActive: boolean;
  subscribedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Subscription = (mongoose.models && mongoose.models.Subscription) || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
export default Subscription;
