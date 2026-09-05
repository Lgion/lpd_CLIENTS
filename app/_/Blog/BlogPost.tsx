import Image from "next/image"
import Link from 'next/link'
import Avatar from './_/avatar'
import type Author from './_/interfaces/author'

type Props = {
  title: string
  coverImage: string
  date: string
  excerpt: string
  author?: Author | string | any
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
  const authorName = typeof author === 'object' && author !== null
    ? (author.name || 'Sanctuaire NDR')
    : (typeof author === 'string' && author ? author : 'Sanctuaire NDR')

  const authorPicture = typeof author === 'object' && author !== null
    ? (author.picture || '/assets/img/logo.png')
    : '/assets/img/logo.png'

  const safeCoverImage = coverImage || '/assets/img/logo.png'

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
            src={safeCoverImage}
            alt={title || 'Article blog'}
            width={600}
            height={400}
            className="post-cover-image"
          />
        </div>
        
        <section className="postContent">
          <div className="postContent__inner">
            <p className="postContent__excerpt">{excerpt}</p>
            <div className="postContent__author">
              <Avatar name={authorName} picture={authorPicture} date={date} />
            </div>
          </div>
        </section>
      </Link>
    </section>
  )
}

export default BlogPost
