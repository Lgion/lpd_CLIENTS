'use client'

import { useEffect, useState, useContext } from 'react'
import BlogCategory from '../_/Blog/BlogCategory'
import BlogPost from '../_/Blog/BlogPost'
import Link from 'next/link'
import AiGenerationModal from './AiGenerationModal'
import AuthContext from "../../stores/authContext.js"

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    coverImage: '',
    content: '',
    category: '',
    youtubeLinks: [], // Nouveau champ pour les liens YouTube
    author: {
      name: '',
      picture: ''
    }
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [previewUrl, setPreviewUrl] = useState('')
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false)
    , { isAdmin } = useContext(AuthContext)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (posts.length > 0) {
      // Extraire toutes les catégories uniques des posts
      const uniqueCategories = [...new Set(posts.map(post => post.category).filter(Boolean))]
      setCategories(uniqueCategories)

      // Filtrer les posts selon la catégorie sélectionnée
      filterPosts(selectedCategory)
    }
  }, [posts, selectedCategory])

  // Charger le brouillon depuis le localStorage au montage
  useEffect(() => {
    const draft = localStorage.getItem('blog_form_draft')
    if (draft && !editingPost) {
      try {
        const parsedDraft = JSON.parse(draft)
        setNewPost(prev => ({ ...prev, ...parsedDraft }))
        if (parsedDraft.title || parsedDraft.content) {
          setShowForm(true)
        }
      } catch (e) {
        console.error("Erreur lors de la lecture du brouillon:", e)
      }
    }
  }, [])

  // Sauvegarder le brouillon dans le localStorage à chaque modification
  useEffect(() => {
    if (!editingPost && (newPost.title || newPost.content || newPost.excerpt)) {
      localStorage.setItem('blog_form_draft', JSON.stringify(newPost))
    }
  }, [newPost, editingPost])

  const filterPosts = (category) => {
    if (category === 'all') {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(posts.filter(post => post.category === category))
    }
  }

  const [repatriationCount, setRepatriationCount] = useState(0);

  async function fetchRepatriationCount() {
    try {
      const res = await fetch('/api/admin/repatriate');
      const data = await res.json();
      setRepatriationCount(data.count || 0);
    } catch (e) { console.error(e); }
  }

  async function fetchPosts() {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data)
      setFilteredPosts(data)
      fetchRepatriationCount()
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error)
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

  const convertToWebP = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        return resolve(file); // Ne pas convertir si ce n'est pas une image
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            const webpName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const webpFile = new File([blob], webpName, { type: 'image/webp' });
            resolve(webpFile);
          }, 'image/webp', 0.85); // Qualité 85%
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const uploadImage = async () => {
    if (!selectedImage) return null

    setUploading(true)

    // Conversion WebP
    const webpFile = await convertToWebP(selectedImage);

    const formData = new FormData()
    formData.append('image', webpFile)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement')
      }
      const data = await response.json()
      console.log('Image uploaded (WebP):', data)
      return data.url
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error)
      return null
    } finally {
      setUploading(false)
    }
  }

  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, slug: null, deleteMedia: false });

  const handleDeleteClick = (slug) => {
    setDeleteConfirm({ show: true, slug, deleteMedia: false });
  };

  const confirmDelete = async () => {
    const { slug, deleteMedia } = deleteConfirm;
    try {
      const response = await fetch(`/api/posts?slug=${slug}&deleteMedia=${deleteMedia}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPosts(posts.filter(p => p.slug !== slug));
        setDeleteConfirm({ show: false, slug: null, deleteMedia: false });
        alert('Article supprimé');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      content: post.content,
      category: post.category,
      youtubeLinks: post.youtubeLinks || [],
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

  const addYoutubeLink = () => {
    setNewPost({ ...newPost, youtubeLinks: [...newPost.youtubeLinks, ''] });
  };

  const updateYoutubeLink = (index, value) => {
    const newLinks = [...newPost.youtubeLinks];
    newLinks[index] = value;
    setNewPost({ ...newPost, youtubeLinks: newLinks });
  };

  const removeYoutubeLink = (index) => {
    const newLinks = newPost.youtubeLinks.filter((_, i) => i !== index);
    setNewPost({ ...newPost, youtubeLinks: newLinks });
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

      // 2. Création/Modification du post
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
      const postSlug = result.slug || (editingPost ? editingPost.slug : null)
      console.log(`[Blog] Post ${editingPost ? 'modified' : 'created'}:`, result)

      // 3. Gestion de la Galerie (Carousel)
      if (postSlug && galleryFiles.length > 0) {
        console.log(`[Blog] Starting gallery upload for slug: ${postSlug} (${galleryFiles.length} files)`)

        for (let i = 0; i < galleryFiles.length; i++) {
          const file = galleryFiles[i]

          // Conversion WebP pour la galerie
          const webpFile = await convertToWebP(file);

          const formData = new FormData()
          formData.append('image', webpFile)

          try {
            console.log(`[Blog] Uploading gallery file ${i + 1}/${galleryFiles.length}: ${file.name}`)
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            })

            if (uploadRes.ok) {
              const uploadData = await uploadRes.json()
              const imageUrl = uploadData.url
              console.log(`[Blog] File uploaded successfully: ${imageUrl}. Registering diapo...`)

              // Créer une entrée dans la table diapo
              const diapoRes = await fetch('/api/diapo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  identifiant_$_hidden: `blog_${postSlug}_0`,
                  src_$_file: imageUrl,
                  alt: newPost.title || 'Photo blog',
                  title: file.name.split('.')[0] || 'Image',
                  cat: 'blog',
                  figcaption: '-', // Rempli pour éviter l'erreur Mongoose required
                  p: '-',          // Rempli pour éviter l'erreur Mongoose required
                  metas: {}
                })
              })

              if (diapoRes.ok) {
                console.log(`[Blog] Diapo ${i + 1} registered successfully in MongoDB`)
              } else {
                const errData = await diapoRes.json()
                console.error(`[Blog] Failed to register diapo ${i + 1}. Mongoose Error:`, errData.error)
              }
            } else {
              console.error(`[Blog] Failed to upload gallery file ${i + 1}`)
            }
          } catch (err) {
            console.error(`[Blog] Error processing gallery file ${i + 1}:`, err)
          }
        }
      }

      localStorage.removeItem('blogPosts')
      localStorage.removeItem('blog_form_draft')

      setShowForm(false)
      setNewPost({
        title: '',
        excerpt: '',
        coverImage: '',
        content: '',
        category: '',
        youtubeLinks: [],
        author: { name: '', picture: '' }
      })
      setSelectedImage(null)
      setGalleryFiles([])
      setPreviewUrl('')
      setEditingPost(null)
      setIsAddingNewCategory(false)
      await fetchPosts()

      alert(`Article ${editingPost ? 'modifié' : 'créé'} avec succès`)
    } catch (error) {
      console.error(`Erreur lors de ${editingPost ? 'la modification' : 'la création'} de l'article:`, error)
      alert(`Erreur lors de ${editingPost ? 'la modification' : 'la création'} de l'article. Veuillez réessayer.`)
    }
  }

  return (
    <main className="blog-container">
      <div className="blog-header">
        <h1>Blog du Sanctuaire Notre Dame du Rosaire de Bolobi</h1>
        <p>
          Une chaine Youtube nous permet aussi de vulgariser nos activités:
          <Link className="ytChannelBtn" href="https://www.youtube.com/@puissancedivineabidjan2568" target="_blank">
            <span className="yt-icon"></span> LPD Bolobi
          </Link>
        </p>

        <div className="category-filters">
          <ul>
            <li>
              <button
                className={selectedCategory === 'all' ? 'active' : ''}
                onClick={() => setSelectedCategory('all')}
              >
                Tous les articles
              </button>
            </li>
            {categories.map(category => (
              <li key={category}>
                <button
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {isAdmin && (
          <button
            className="fab-add-post"
            title="Nouvel article"
            onClick={() => {
              if (showForm && editingPost) {
                setEditingPost(null)
                setNewPost({
                  title: '',
                  excerpt: '',
                  coverImage: '',
                  content: '',
                  category: '',
                  author: { name: '', picture: '' }
                })
                setSelectedImage(null)
                setPreviewUrl('')
              }
              setShowForm(!showForm)
            }}
          >
            {showForm ? '×' : '+'}
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} className="blog-form">
          <div className="aiGenerationModal__header">
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              className="aiGenerationModal__triggerBtn"
            >
              🪄 Générer le post via IA
            </button>
            <p className="aiGenerationModal__headerDesc">
              Chargez des photos, vidéos ou audios pour pré-remplir automatiquement ce formulaire.
            </p>
          </div>

          <div className="form-group">
            <label>Titre</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Extrait</label>
            <textarea
              value={newPost.excerpt}
              onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
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
            <label>Galerie Photos & Vidéos (Diaporama en fin d'article)</label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
              className="file-input"
            />
            {galleryFiles.length > 0 && (
              <p className="file-count">{galleryFiles.length} fichier(s) sélectionné(s)</p>
            )}
          </div>
          <div className="form-group">
            <label>Vidéos YouTube (Liens)</label>
            <div className="youtube-links-manager">
              {newPost.youtubeLinks.map((link, index) => (
                <div key={index} className="youtube-link-row">
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={link}
                    onChange={(e) => updateYoutubeLink(index, e.target.value)}
                  />
                  <button
                    type="button"
                    className="remove-yt-btn"
                    onClick={() => removeYoutubeLink(index)}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-yt-btn"
                onClick={addYoutubeLink}
              >
                + Ajouter une vidéo
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Contenu (Markdown)</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              required
              rows="10"
            />
          </div>
          <div className="form-group">
            <label>Catégorie</label>
            <select
              value={isAddingNewCategory ? 'new' : newPost.category}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'new') {
                  setIsAddingNewCategory(true);
                  setNewPost({ ...newPost, category: '' });
                } else {
                  setIsAddingNewCategory(false);
                  setNewPost({ ...newPost, category: value });
                }
              }}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="new">Nouvelle catégorie...</option>
            </select>
            {isAddingNewCategory && (
              <input
                type="text"
                autoFocus
                placeholder="Entrez le nom de la nouvelle catégorie"
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                required
              />
            )}
          </div>
          <div className="form-group">
            <label>Nom de l'auteur</label>
            <input
              type="text"
              value={newPost.author.name}
              onChange={(e) => setNewPost({
                ...newPost,
                author: { ...newPost.author, name: e.target.value }
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

      {showAiModal && (
        <AiGenerationModal
          onClose={() => setShowAiModal(false)}
          onSuccess={(postData, capturedFiles) => {
            // 1. Mettre à jour les champs texte
            setNewPost(prev => ({
              ...prev,
              title: postData.title || prev.title,
              excerpt: postData.excerpt || prev.excerpt,
              content: postData.content || prev.content,
              category: postData.category || prev.category,
              // 2. Extraire les liens
              youtubeLinks: [
                ...prev.youtubeLinks,
                ...capturedFiles
                  .filter(f => f.isLink)
                  .map(f => f.url)
              ]
            }));

            // 3. Extraire les médias (images et vidéos)
            const mediaFiles = capturedFiles.filter(f =>
              !f.isLink && (f.type.startsWith('image/') || f.type.startsWith('video/'))
            );

            if (mediaFiles.length > 0) {
              // On ajoute à la galerie
              setGalleryFiles(prev => [...prev, ...mediaFiles]);

              // Si aucune image de couverture n'est déjà sélectionnée, on prend la première image du lot
              const firstImage = mediaFiles.find(f => f.type.startsWith('image/'));
              if (firstImage && !selectedImage) {
                setSelectedImage(firstImage);
                setPreviewUrl(URL.createObjectURL(firstImage));
              }
            }

            setShowForm(true);
            setShowAiModal(false);
          }}
        />
      )}

      {deleteConfirm.show && (
        <div className="c-modal">
          <div className="c-modal__main">
            <div className="c-modal__header">
              <figcaption><strong>Confirmation de suppression</strong></figcaption>
            </div>
            <div className="c-modal__body" style={{ padding: '20px' }}>
              <p>Êtes-vous sûr de vouloir supprimer cet article ?</p>
              <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="deleteMedia"
                  checked={deleteConfirm.deleteMedia}
                  onChange={(e) => setDeleteConfirm({ ...deleteConfirm, deleteMedia: e.target.checked })}
                />
                <label htmlFor="deleteMedia">Supprimer DÉFINITIVEMENT les images (sinon elles seront archivées)</label>
              </div>
            </div>
            <div className="c-modal__footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '15px' }}>
              <button onClick={() => setDeleteConfirm({ show: false, slug: null, deleteMedia: false })} className="cancel safe">Annuler</button>
              <button onClick={confirmDelete} style={{ background: '#ff4757', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>Supprimer l'article</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Chargement des posts...</div>
      ) : (
        <>
          <div className="admin-actions-bar" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            {isAdmin && (
              <button
                onClick={async () => {
                  if (confirm(`Voulez-vous rapatrier les ${repatriationCount} images Cloudinary vers le serveur local ?`)) {
                    const res = await fetch('/api/admin/repatriate', { method: 'POST' });
                    const data = await res.json();
                    alert(`Rapatriement terminé : ${data.report.posts} articles et ${data.report.slider} images de galerie mis à jour.`);
                    fetchPosts();
                  }
                }}
                disabled={repatriationCount === 0}
                className="repatriate-btn"
                style={{
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: repatriationCount === 0 ? 'not-allowed' : 'pointer',
                  opacity: repatriationCount === 0 ? 0.5 : 1
                }}
              >
                📥 Rapatrier les images ({repatriationCount})
              </button>
            )}
            {isAdmin && (
              <Link
                href="/blog/archive_images"
                className="archive-link-btn"
                style={{
                  background: '#2ecc71',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                🗄️ Voir l'Archive Images
              </Link>
            )}
          </div>
          <BlogCategory
            categoryPosts={filteredPosts}
            headings={{
              h3: selectedCategory === 'all' ? "Articles récents" : `Articles - ${selectedCategory}`,
              subtitle: "Découvrez nos derniers articles"
            }}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </>
      )}
    </main>
  )
}
