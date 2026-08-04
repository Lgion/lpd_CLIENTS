import mongoose from 'mongoose';

// URI MongoDB depuis l'env ou fallback local
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lpd';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Utilisation d'un cache global pour réutiliser la connexion
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connexion MongoDB optimisée pour Next.js API routes
 * - Réutilise la connexion si déjà ouverte
 * - Ne jamais fermer la connexion dans une API route
 * - Utilise le pattern singleton avec gestion des requêtes simultanées
 */
async function dbConnect() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
