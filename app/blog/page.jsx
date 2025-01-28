'use client'

import { useEffect, useState } from 'react'
import BlogCategory from '../_/Blog/BlogCategory'
import BlogPost from '../_/Blog/BlogPost'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    coverImage: '',
    content: '',
    author: {
      name: '',
      picture: ''
    }
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const uploadImage = async () => {
    if (!selectedImage) return null

    setUploading(true)
    const formData = new FormData()
    formData.append('image', selectedImage)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement')
      }
      const data = await response.json()
      console.log('Image uploaded:', data)
      return data.url
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (slug) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts?slug=${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      localStorage.removeItem('blogPosts');
      await fetchPosts();
      alert('Article supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'article');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      content: post.content,
      author: {
        name: post.author.name,
        picture: post.author.picture || ''
      }
    });
    if (post.coverImage) {
      setPreviewUrl(post.coverImage);
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let coverImage = newPost.coverImage
      if (selectedImage) {
        console.log('Uploading image...')
        const imageUrl = await uploadImage()
        if (imageUrl) {
          console.log('Image uploaded successfully:', imageUrl)
          coverImage = imageUrl
        } else {
          console.error('Failed to upload image')
          return
        }
      }

      const postData = {
        ...newPost,
        coverImage,
        date: editingPost ? editingPost.date : new Date().toISOString(),
      }

      const url = editingPost 
        ? `/api/posts?slug=${editingPost.slug}`
        : '/api/posts'

      const method = editingPost ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de ${editingPost ? 'la modification' : 'la création'} du post`)
      }

      const result = await response.json()
      console.log(`Post ${editingPost ? 'modified' : 'created'}:`, result)

      localStorage.removeItem('blogPosts')

      setShowForm(false)
      setNewPost({
        title: '',
        excerpt: '',
        coverImage: '',
        content: '',
        author: { name: '', picture: '' }
      })
      setSelectedImage(null)
      setPreviewUrl('')
      setEditingPost(null)
      await fetchPosts()
      
      alert(`Article ${editingPost ? 'modifié' : 'créé'} avec succès`)
    } catch (error) {
      console.error(`Erreur lors de ${editingPost ? 'la modification' : 'la création'} de l'article:`, error)
      alert(`Erreur lors de ${editingPost ? 'la modification' : 'la création'} de l'article. Veuillez réessayer.`)
    }
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Notre Blog</h1>
        <button 
          className="new-post-btn"
          onClick={() => {
            if (showForm && editingPost) {
              setEditingPost(null);
              setNewPost({
                title: '',
                excerpt: '',
                coverImage: '',
                content: '',
                author: { name: '', picture: '' }
              });
              setSelectedImage(null);
              setPreviewUrl('');
            }
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Annuler' : 'Nouvel Article'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label>Titre</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Extrait</label>
            <textarea
              value={newPost.excerpt}
              onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Image de couverture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {(previewUrl || newPost.coverImage) && (
              <div className="image-preview">
                <img src={previewUrl || newPost.coverImage} alt="Prévisualisation" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Contenu (Markdown)</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              required
              rows="10"
            />
          </div>
          <div className="form-group">
            <label>Nom de l'auteur</label>
            <input
              type="text"
              value={newPost.author.name}
              onChange={(e) => setNewPost({
                ...newPost, 
                author: {...newPost.author, name: e.target.value}
              })}
              required
            />
          </div>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={uploading}
          >
            {uploading ? 'Téléchargement...' : (editingPost ? 'Modifier l\'article' : 'Publier l\'article')}
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Chargement des articles...</div>
      ) : (
        <div className="blog-grid">
          <BlogCategory 
            categoryPosts={posts}
            headings={{
              h3: "Articles récents",
              subtitle: "Découvrez nos derniers articles"
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  )
}
