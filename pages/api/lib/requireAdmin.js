import { getAuth } from '@clerk/nextjs/server';

/**
 * Utility to enforce server-side admin authentication on API routes
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 * @returns {Promise<boolean>} True if authenticated, false if response handled
 */
export async function requireAdminAuth(req, res) {
  try {
    const { userId } = getAuth(req);
    
    // In development or test if bypass is configured, allow
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_ADMIN_BYPASS === 'true') {
      return true;
    }

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentification requise (Connexion demandée)' });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification admin:', error);
    res.status(500).json({ success: false, message: 'Erreur d\'authentification serveur' });
    return false;
  }
}

export default requireAdminAuth;
