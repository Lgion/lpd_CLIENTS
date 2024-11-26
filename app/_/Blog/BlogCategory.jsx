import Head from 'next/head'
// import Container from '../../../blog/components/container'
// import MoreStories from '../../../blog/components/more-stories'
import BlogPost from './BlogPost'
// import Intro from '../../../blog/components/intro'
// import Layout from '../../../blog/components/layout'
// import { CMS_NAME } from '../../../blog/lib/constants'
// import '../../../blog/styles/index.module.css'

const BLOG_NAME = "BOLOBI"

import { useEffect, useState, useCallback, useMemo } from 'react';

export default function BlogCategory({categoryPosts,headings,className=""}) {

    // console.log(categoryPosts);
    
    // const handleBtn = (e) => {
    //     if(blog_container.classList.contains('on')){
    //       blog_container.classList.remove('on')
    //       e.target.innerHTML = "AFFICHER LE BLOG"
    //     }else{
    //       blog_container.classList.add('on')
    //       e.target.innerHTML = "FERMER LE BLOG"
    //     }
    // }
    
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        const storedPosts = localStorage.getItem('blogPosts');
        
        console.log("Stored posts from localStorage:", storedPosts); // Débogage

        if (storedPosts) {
            try {
                const parsedPosts = JSON.parse(storedPosts);
                if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
                    console.log("Using posts from localStorage"); // Débogage
                    setPosts(parsedPosts);
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.error('Erreur lors de la lecture du localStorage:', error);
            }
        }

        try {
            console.log("Fetching posts from API"); // Débogage
            const response = await fetch('/api/posts');
            const data = await response.json();
            
            console.log("Received data from API:", data); // Débogage

            if (Array.isArray(data) && data.length > 0) {
                setPosts(data);
                localStorage.setItem('blogPosts', JSON.stringify(data));
                console.log("Saved posts to localStorage"); // Débogage
            } else {
                console.error('Les données reçues ne sont pas un tableau valide');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des posts:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const memoizedPosts = useMemo(() => posts, [posts]);

    if (isLoading) {
        return <div>Chargement des articles...</div>;
    }

    return (
        <div id="blog_container" className={"container mx-auto px-5 "+className}>
            <h2>ARTICLES DU BLOG DE {BLOG_NAME}</h2>
            <h3 id="blog">{headings?.h3 || ".....VALEUR PAR DÉFAUT....."}</h3>
            {memoizedPosts.map((post, i) => (
                <BlogPost
                    key={"post_" + post.category + "_" + i}
                    title={post.title}
                    coverImage={post.coverImage}
                    date={post.date}
                    author={post.author}
                    slug={post.slug}
                    excerpt={post.excerpt}
                />
            ))}
        </div>
    )
}
