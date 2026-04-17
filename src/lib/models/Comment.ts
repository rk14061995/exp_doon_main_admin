import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  name: string;
  email: string;
  content: string;
  page: string;
  status: 'pending' | 'approved' | 'rejected';
  parentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  page: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
}, {
  timestamps: true,
});

CommentSchema.index({ page: 1 });
CommentSchema.index({ status: 1 });

const Comment = (mongoose.models && mongoose.models.Comment) || mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
