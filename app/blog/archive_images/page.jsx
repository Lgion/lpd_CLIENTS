'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ArchiveImagesPage() {
  const [archives, setArchives] = useState([]);
  const [isWritable, setIsWritable] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/archive');
      const data = await res.json();
      setArchives(data.files || []);
      setIsWritable(data.isWritable);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const handleDelete = async (filename) => {
    if (!confirm(`Supprimer définitivement ${filename} ?`)) return;

    try {
      const res = await fetch(`/api/admin/archive?filename=${filename}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setArchives(archives.filter(a => a.name !== filename));
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="archive-page" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <Link href="/blog" style={{ color: '#3498db', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
          ← Retour au Blog
        </Link>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#333' }}>
          Archives des Images
        </h1>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Toutes les images des articles supprimés sont conservées ici.
        </p>
      </header>

      {!isWritable && (
        <div style={{ 
          background: '#fff3cd', 
          color: '#856404', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #ffeeba',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <strong>⚠️ Mode lecture seule :</strong> Il n'est pas possible de supprimer des images depuis ce serveur (probablement Vercel). 
          Pour faire le ménage, lancez l'application sur un serveur local, rapatriez les images, puis gérez-les depuis ici.
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Chargement des archives...</div>
      ) : archives.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px', background: '#f9f9f9', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.2rem', color: '#999' }}>Aucune image archivée pour le moment.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {archives.map((file) => (
            <div key={file.name} className="archive-card" style={{ 
              background: 'white', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              border: '1px solid #eee',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ position: 'relative', paddingTop: '75%', background: '#f0f0f0' }}>
                <img 
                  src={file.url} 
                  alt={file.name} 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              </div>
              <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '5px', wordBreak: 'break-all' }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#ccc' }}>
                    Archivé le : {new Date(file.mtime).toLocaleDateString()}
                  </p>
                </div>
                {isWritable && (
                  <button 
                    onClick={() => handleDelete(file.name)}
                    style={{ 
                      marginTop: '15px',
                      background: '#ff4757', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px', 
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      width: '100%'
                    }}
                  >
                    Supprimer définitivement
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
