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
    <section className="schoolPosts">
      <h4 className="">
        <Link
          as={`/posts/${slug}`}
          href="/posts/[slug]"
          className=""
        >
          {title}
          {category && <span className={`category-badge ${category}`}>{category}</span>}
        </Link>
      </h4>
      {/* <CoverImage title={title} src={coverImage} slug={slug} /> */}
      <Link as={`/posts/${slug}`} href="/posts/[slug]" aria-label={title}>
        <Image
          src={coverImage}
          alt={`Cover Image for ${title}`}
          width={1300}
          height={630}
        />
      </Link>
      <section className="">
        <p className="">{excerpt}</p>
        <div>
          <Avatar name={author.name} picture={author.picture} date={date} />&nbsp;
        </div>
      </section>
    </section>
  )
}

export default BlogPost
