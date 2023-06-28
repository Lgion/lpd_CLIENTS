import Head from 'next/head'
import Container from './components/container'
import MoreStories from './components/more-stories'
import HeroPost from './components/hero-post'
import Intro from './components/intro'
import Layout from './components/layout'
import { CMS_NAME } from './lib/constants'
// import './styles/index.module.css'


export default function Blog({heroPost, morePosts, allPosts}) {

    const handleBtn = (e) => {
        if(blog_container.classList.contains('on')){
          blog_container.classList.remove('on')
          e.target.innerHTML = "AFFICHER LE BLOG"
        }else{
          blog_container.classList.add('on')
          e.target.innerHTML = "FERMER LE BLOG"
        }
    }
    
    return <>
        {/* <Layout> */}
            {/* <Head>
                <title>{`Next.js Blog Example with ${CMS_NAME}`}</title>
            </Head> */}
            <button id="do_blog_btn" onClick={handleBtn}>AFFICHER LE BLOG</button>
            {/* <Container> */}
            <div id="blog_container" className="container mx-auto px-5">
                <Intro />
                {heroPost && (
                    <HeroPost
                        title={heroPost.title}
                        coverImage={heroPost.coverImage}
                        date={heroPost.date}
                        author={heroPost.author}
                        slug={heroPost.slug}
                        excerpt={heroPost.excerpt}
                    />
                )}
                {morePosts.length > 0 && <MoreStories posts={morePosts} />}
            {/* </Container> */}
            </div>
        {/* </Layout> */}
    </>
}


