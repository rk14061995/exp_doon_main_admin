import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  slug: string;
  title: string;
  summary: string;
  featuredImage: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  excerpt: string;
  keywords: string[];
  metaDescription: string;
  metaTitle: string;
  reqInfo: string;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
  },
  featuredImage: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  readTime: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    trim: true,
  },
  keywords: [{
    type: String,
    trim: true,
  }],
  metaDescription: {
    type: String,
    trim: true,
  },
  metaTitle: {
    type: String,
    trim: true,
  },
  reqInfo: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

ArticleSchema.index({ slug: 1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ date: -1 });

const Article = (mongoose.models && mongoose.models.Article) || mongoose.model<IArticle>('articles', ArticleSchema);
export default Article;
