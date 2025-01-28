'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'

export default function BlogPost() {
  const params = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`)
        if (!response.ok) {
          throw new Error('Article non trouvé')
        }
        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchPost()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="blog-post-loading">
        <div className="spinner">Chargement...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-post-error">
        <h1>Article non trouvé</h1>
        <p>L'article que vous recherchez n'existe pas ou a été supprimé.</p>
        <a href="/blog" className="back-link">Retour au blog</a>
      </div>
    )
  }

  return (
    <article className="blog-post">
      <div className="blog-post-header">
        <h1>{post.title}</h1>
        {post.coverImage && (
          <div className="blog-post-cover">
            <img src={post.coverImage} alt={post.title} />
          </div>
        )}
        <div className="blog-post-meta">
          <div className="blog-post-author">
            {post.author.picture && (
              <img src={post.author.picture} alt={post.author.name} className="author-avatar" />
            )}
            <span>{post.author.name}</span>
          </div>
          <time dateTime={post.date}>
            {format(new Date(post.date), 'dd MMMM yyyy', { locale: fr })}
          </time>
        </div>
      </div>
      
      <div className="blog-post-content">
        <div className="blog-post-excerpt">
          {post.excerpt}
        </div>
        <div className="blog-post-body">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>
      
      <div className="blog-post-footer">
        <a href="/blog" className="back-to-blog">
          ← Retour aux articles
        </a>
      </div>
    </article>
  )
}
