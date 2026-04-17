import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  page: string;
  views: number;
  uniqueVisitors: number;
  date: Date;
  userAgent?: string;
  ip?: string;
  referrer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema: Schema = new Schema({
  page: {
    type: String,
    required: true,
    trim: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  userAgent: {
    type: String,
    trim: true,
  },
  ip: {
    type: String,
    trim: true,
  },
  referrer: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

AnalyticsSchema.index({ page: 1, date: 1 });

const Analytics = (mongoose.models && mongoose.models.Analytics) || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
export default Analytics;
