import mongoose, { Schema, Document } from 'mongoose';

export interface ISEO extends Document {
  page: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robots?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SEOSchema: Schema = new Schema({
  page: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  keywords: [{
    type: String,
    trim: true,
  }],
  ogTitle: {
    type: String,
    trim: true,
  },
  ogDescription: {
    type: String,
    trim: true,
  },
  ogImage: {
    type: String,
  },
  canonicalUrl: {
    type: String,
    trim: true,
  },
  robots: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const SEO = (mongoose.models && mongoose.models.SEO) || mongoose.model<ISEO>('SEO', SEOSchema);
export default SEO;
