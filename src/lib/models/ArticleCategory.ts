import mongoose, { Schema, Document } from 'mongoose';

export interface IArticleCategory extends Document {
  slug: string;
  name: string;
  description: string;
  image?: string;
  articleCount?: number;
}

const ArticleCategorySchema: Schema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
  articleCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: false, // Your schema doesn't have timestamps
});

ArticleCategorySchema.index({ slug: 1 });

// const ArticleCategory = (mongoose.models && mongoose.models.ArticleCategory) || mongoose.model<IArticleCategory>('articleCategories', ArticleCategorySchema);
const ArticleCategory =
  mongoose.models.ArticleCategory ||
  mongoose.model<IArticleCategory>(
    'ArticleCategory',
    ArticleCategorySchema,
    'articleCategories' // ✅ exact match
  );
export default ArticleCategory;
