import { getAuth } from '@clerk/nextjs/server';

/**
 * Utility to enforce server-side admin authentication on API routes
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 * @returns {Promise<boolean>} True if authenticated, false if response handled
 */
export async function requireAdminAuth(req, res) {
  console.log('[DEBUG ADMIN Backend requireAdminAuth called]', {
    url: req.url,
    cookiesPresent: !!req.headers.cookie,
    allowBypass: process.env.ALLOW_ADMIN_BYPASS
  });

  if (process.env.ALLOW_ADMIN_BYPASS === 'true') {
    console.log('[DEBUG ADMIN Backend] Bypass active via ALLOW_ADMIN_BYPASS');
    return true;
  }

  try {
    const authData = getAuth(req);
    console.log('[DEBUG ADMIN Backend Clerk AuthData]', { userId: authData?.userId });

    if (!authData?.userId) {
      console.log('[DEBUG ADMIN Backend] No userId found in Clerk request headers -> returning 401');
      res.status(401).json({ 
        success: false, 
        message: 'Authentification requise. Veuillez vous connecter.' 
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('[DEBUG ADMIN Backend Exception in requireAdminAuth]', error.message);
    res.status(401).json({ 
      success: false, 
      message: 'Authentification requise. Veuillez vous reconnecter.' 
    });
    return false;
  }
}

export default requireAdminAuth;
