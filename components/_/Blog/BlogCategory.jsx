import Head from 'next/head'
// import Container from '../../../blog/components/container'
// import MoreStories from '../../../blog/components/more-stories'
import BlogPost from './BlogPost'
// import Intro from '../../../blog/components/intro'
// import Layout from '../../../blog/components/layout'
// import { CMS_NAME } from '../../../blog/lib/constants'
// import '../../../blog/styles/index.module.css'

const BLOG_NAME = "BOLOBI"


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
    
    return <>
        {/* <Layout> */}
            {/* <Head>
                <title>{`Next.js Blog Example with ${CMS_NAME}`}</title>
            </Head> */}
            {/* <button id="do_blog_btn" onClick={handleBtn}>AFFICHER LE BLOG</button> */}
            {/* <Container> */}
            <div id="blog_container" className={"container mx-auto px-5 "+className}>
                {/* <Intro /> */}
                <h2>ARTICLES DU BLOG DE {BLOG_NAME}</h2>
                <h3 id="blog">{headings?.h3 || ".....VALEUR PAR DÉFAUT....."}</h3>
                {categoryPosts && categoryPosts.map((post,i) => <BlogPost
                        key={"post_"+post.category+"_"+i}
                        title={post.title}
                        coverImage={post.coverImage}
                        date={post.date}
                        author={post.author}
                        slug={post.slug}
                        excerpt={post.excerpt}
                    />
                )}
                {/* {categoryPosts.length > 0 && <MoreStories posts={categoryPosts} />} */}
            {/* </Container> */}
            </div>
        {/* </Layout> */}
    </>
}


