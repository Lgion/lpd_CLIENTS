"use client";
import Head from 'next/head'
import BlogPost from './BlogPost'
import { useEffect, useState, useCallback, useMemo } from 'react';

const BLOG_NAME = "BOLOBI"

export default function BlogCategory({ categoryPosts, headings, className = "", onEdit, onDelete, isAdmin, filterCategory }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    const storedPosts = localStorage.getItem('blogPosts');

    console.log("Stored posts from localStorage:", storedPosts);

    if (storedPosts) {
      try {
        const parsedPosts = JSON.parse(storedPosts);
        if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
          console.log("Using posts from localStorage");
          setPosts(parsedPosts);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Erreur lors de la lecture du localStorage:', error);
      }
    }

    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      console.log("Fetched posts from API:", data);

      if (Array.isArray(data)) {
        setPosts(data);
        localStorage.setItem('blogPosts', JSON.stringify(data));
      } else {
        console.error('Les données reçues ne sont pas un tableau:', data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (categoryPosts && Array.isArray(categoryPosts)) {
      setPosts(categoryPosts);
      setIsLoading(false);
    } else {
      fetchPosts();
    }
  }, [categoryPosts, fetchPosts]);

  const filteredPosts = useMemo(() => {
    console.log("--- BLOG FILTERING DEBUG ---");
    console.log("Total posts available:", posts.length);
    console.log("Requested filter category:", filterCategory);

    if (!filterCategory) {
        console.log("No filter category provided, returning all posts.");
        return posts;
    }
    
    const normalizeStr = (str) => 
      str ? str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim() : "";
      
    const filter = normalizeStr(filterCategory);
    console.log("Normalized filter string:", `"${filter}"`);
    
    const result = posts.filter((post, index) => {
      const postCat = normalizeStr(post.category);
      const postCats = Array.isArray(post.categories) ? post.categories.map(normalizeStr) : [];
      const postTitle = post.title ? normalizeStr(post.title) : "";
      
      const isMatch = postCat === filter || postCats.includes(filter) || postTitle.includes(filter);
      
      if (index < 10) {
          console.log(`Checking post "${post.title}":`, {
              category: post.category,
              normalizedCat: postCat,
              isMatch: isMatch
          });
      }

      return isMatch;
    });

    console.log("Number of posts after filtering:", result.length);
    console.log("--- END BLOG DEBUG ---");
    return result;
  }, [posts, filterCategory]);

  return (
    <>
      <hr />
      <div className="blog_category_header">
        <h2>BLOG: </h2>
        <h3>{headings.h3}</h3>
        <p>{headings.subtitle}</p>
      </div>
      <div className="blog_category_posts blog-grid">
        {isLoading ? (
          <div>Chargement...</div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.slug} className="blog-post-container">
              <BlogPost
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
                slug={post.slug}
                excerpt={post.excerpt}
                category={post.category}
              />
              {isAdmin && <div className="blog-post-actions">
                <button
                  onClick={() => onEdit(post)}
                  className="edit-btn"
                >
                  Modifier
                </button>
                <button
                  onClick={() => onDelete(post.slug)}
                  className="delete-btn"
                >
                  Supprimer
                </button>
              </div>}
            </div>
          ))
        ) : (
          <div>Aucun article de blog disponible</div>
        )}
      </div>
    </>
  )
}
