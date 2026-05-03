import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import https from 'https';
import mongoose from 'mongoose';
import Slider from '../_/models/Slider';

const downloadImage = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

export default async function handler(req, res) {
  const postsDir = path.join(process.cwd(), '_posts');
  const uploadDir = path.join(process.cwd(), 'public/img/blog');

  if (req.method === 'GET') {
    try {
      if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGODB_URI);
      let count = 0;
      if (fs.existsSync(postsDir)) {
        const files = fs.readdirSync(postsDir);
        for (const file of files) {
          if (!file.endsWith('.md')) continue;
          const { data } = matter(fs.readFileSync(path.join(postsDir, file), 'utf8'));
          if (data.coverImage && data.coverImage.startsWith('http')) count++;
        }
      }
      count += await Slider.countDocuments({ src_$_file: /^http/ });
      return res.status(200).json({ count });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  // Test écriture
  try {
    const testFile = path.join(uploadDir, '.test');
    fs.writeFileSync(testFile, 't');
    fs.unlinkSync(testFile);
  } catch (e) {
    return res.status(403).json({ error: 'Server is read-only. Cannot repatriate.' });
  }

  try {
    if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGODB_URI);
    let report = { posts: 0, slider: 0, errors: [] };

    // 1. Scan Posts (Markdown)
    if (fs.existsSync(postsDir)) {
      const files = fs.readdirSync(postsDir);
      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        const fullPath = path.join(postsDir, file);
        const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
        
        if (data.coverImage && data.coverImage.startsWith('http')) {
          const ext = path.extname(new URL(data.coverImage).pathname) || '.webp';
          const newName = `repatriated-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
          const dest = path.join(uploadDir, newName);
          
          try {
            await downloadImage(data.coverImage, dest);
            data.coverImage = `/img/blog/${newName}`;
            fs.writeFileSync(fullPath, matter.stringify(content, data));
            report.posts++;
          } catch (e) { report.errors.push(`Post ${file}: ${e.message}`); }
        }
      }
    }

    // 2. Scan Slider (MongoDB)
    const diapos = await Slider.find({ src_$_file: /^http/ });
    for (const diapo of diapos) {
      const ext = path.extname(new URL(diapo.src_$_file).pathname) || '.webp';
      const newName = `repatriated-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
      const dest = path.join(uploadDir, newName);
      try {
        await downloadImage(diapo.src_$_file, dest);
        diapo.src_$_file = `/img/blog/${newName}`;
        await diapo.save();
        report.slider++;
      } catch (e) { report.errors.push(`Slider ${diapo._id}: ${e.message}`); }
    }
    res.status(200).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
