import Image from "next/image"
import Link from 'next/link'
import Avatar from './_/avatar'
import CoverImage from './_/cover-image'
import type Author from './_/interfaces/author'

type Props = {
  title: string
  coverImage: string
  date: string
  excerpt: string
  author: Author
  slug: string
  category?: string
}

const BlogPost = ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  category,
}: Props) => {

  return (
    <section className="ndrPosts">
      {category && (
        <span className={`category-badge-floating ${category}`}>
          {category}
        </span>
      )}
      
      <h4 className="post-title-main">
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          {title}
        </Link>
      </h4>

      <Link as={`/posts/${slug}`} href="/posts/[slug]" className="post-link-container">
        <div className="post-image-wrapper">
          <Image
            src={coverImage}
            alt={title}
            width={600}
            height={400}
            className="post-cover-image"
          />
        </div>
        
        <section className="postContent">
          <div className="postContent__inner">
            <p className="postContent__excerpt">{excerpt}</p>
            <div className="postContent__author">
              <Avatar name={author.name} picture={author.picture} date={date} />
            </div>
          </div>
        </section>
      </Link>
    </section>
  )
}

export default BlogPost
