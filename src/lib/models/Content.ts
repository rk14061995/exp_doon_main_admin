import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  title: string;
  slug: string;
  content: string;
  type: 'page' | 'post' | 'tour' | 'category';
  status: 'draft' | 'published' | 'archived';
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  tags: string[];
  views: number;
  likes: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['page', 'post', 'tour', 'category'],
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  excerpt: {
    type: String,
    trim: true,
  },
  featuredImage: {
    type: String,
  },
  category: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  publishedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

ContentSchema.index({ slug: 1 });
ContentSchema.index({ type: 1 });
ContentSchema.index({ status: 1 });

const Content = (mongoose.models && mongoose.models.Content) || mongoose.model<IContent>('Content', ContentSchema);
export default Content;
