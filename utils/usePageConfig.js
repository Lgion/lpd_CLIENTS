import { useState, useEffect } from 'react';

export function usePageConfig(pageId = 'home') {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/page_config?pageId=${pageId}`);
      if (!res.ok) throw new Error('Erreur de chargement de la configuration');
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error(`Erreur usePageConfig (${pageId}):`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [pageId]);

  return { config, loading, error, refetch: fetchConfig };
}
