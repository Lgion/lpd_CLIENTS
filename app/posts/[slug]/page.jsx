'use client'

import { useEffect, useState, useContext } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Carousel from '../../_/Carousel'
import AuthContext from "../../../stores/authContext.js"

export default function PostPage() {
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const { isAdmin } = useContext(AuthContext)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`)
        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      fetchPost()
    }
  }, [params.slug])

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return
    try {
      const response = await fetch(`/api/posts?slug=${params.slug}`, { method: 'DELETE' })
      if (response.ok) {
        router.push('/blog')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (isLoading) return (
    <div className="post-loading-wrapper">
      <div className="spinner-container">
        <div className="premium-spinner"></div>
        <p>Chargement de votre article...</p>
      </div>
    </div>
  )
  if (!post) return <div className="loading">Article non trouvé</div>

  return (
    <article className="post-content">
      <div className="post-navigation">
        <button onClick={() => router.push('/blog')} className="back-button">
          ← Retour au blog
        </button>
        
        {isAdmin && (
          <div className="admin-actions">
            <button 
              onClick={() => router.push(`/blog?edit=${params.slug}`)} 
              className="edit-btn"
            >
              Modifier
            </button>
            <button onClick={handleDelete} className="delete-btn">
              Supprimer
            </button>
          </div>
        )}
      </div>

      <header className="post-header">
        <h1>
          {post.title}
          {post.category && (
            <span className={`category-badge ${post.category}`}>
              {post.category}
            </span>
          )}
        </h1>
        
        <div className="post-meta">
          <p className="post-author">Par {post.author?.name || 'Auteur inconnu'}</p>
          <p className="post-date">{new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        {post.excerpt && (
          <div className="post-excerpt-intro">
            <p>{post.excerpt}</p>
          </div>
        )}
      </header>

      {post.coverImage && (
        <div className="post-cover-image">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1000}
            height={500}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <Carousel page={`blog_${params.slug}`} titre="Galerie de l'article" />

      {post.youtubeLinks && post.youtubeLinks.length > 0 && (
        <section className="post-videos-section">
          <h3>Vidéos de l'article</h3>
          <div className="videos-grid">
            {post.youtubeLinks.map((link, index) => {
              const videoId = link.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sanday\?v=|\/search\?q=|\/playlist\?list=|\/live\/|\/shorts\/))([^"&?\/\s]{11})/)?.[1];
              if (!videoId) return null;
              return (
                <div key={index} className="video-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`YouTube video player ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="post-body" dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  )
}
