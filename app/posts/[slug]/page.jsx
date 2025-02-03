'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

export default function PostPage() {
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  
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

  if (isLoading) return <div>Chargement...</div>
  if (!post) return <div>Article non trouvé</div>

  return (
    <article className="post-content">
      <button 
        onClick={() => router.push('/blog')}
        className="back-button"
      >
        ← Retour au blog
      </button>
      
      <h1>{post.title}</h1>
      <div className="post-meta">
        <p>Par {post.author?.name || 'Auteur inconnu'}</p>
        <p>{new Date(post.date).toLocaleDateString()}</p>
      </div>
      {post.coverImage && (
        <div className="post-cover-image">
          <Image 
            src={post.coverImage} 
            alt={post.title}
            width={800}
            height={400}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <div 
        className="post-body"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
