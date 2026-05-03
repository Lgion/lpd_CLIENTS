import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import https from 'https';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const isWritable = (dir) => {
  try {
    const testFile = path.join(dir, '.write-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    return true;
  } catch (e) { return false; }
};

export default async function handler(req, res) {
  const uploadDir = path.join(process.cwd(), 'public/img/blog');
  if (!fs.existsSync(uploadDir)) {
    try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}
  }

  const writable = isWritable(uploadDir);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: 'Upload error' }) && resolve();

        const file = files.image?.[0];
        if (!file) return res.status(400).json({ error: 'No file' }) && resolve();

        if (!writable) {
          // CLOUDINARY UPLOAD (Fallback)
          try {
            const result = await cloudinary.uploader.upload(file.filepath, {
              folder: 'lpd_bolobi_posts',
            });
            res.status(200).json({ url: result.secure_url, cloudinary: true });
          } catch (uploadErr) {
            console.error('Cloudinary error:', uploadErr);
            res.status(500).json({ error: 'Failed to upload to Cloudinary' });
          }
          return resolve();
        }

        // LOCAL UPLOAD
        const ext = path.extname(file.originalFilename) || '.webp';
        const newFilename = `post-${Date.now()}${ext}`;
        const finalPath = path.join(uploadDir, newFilename);
        
        fs.renameSync(file.filepath, finalPath);
        res.status(200).json({ url: `/img/blog/${newFilename}` });
        resolve();
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}