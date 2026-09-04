import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  excerpt: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  content: { type: String, required: true },
  category: { type: String, default: 'Général' },
  date: { type: String, default: () => new Date().toISOString() },
  author: {
    name: { type: String, default: 'LPD' },
    picture: { type: String, default: '' }
  },
  youtubeLinks: [{ type: String }],
  published: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', postSchema);
