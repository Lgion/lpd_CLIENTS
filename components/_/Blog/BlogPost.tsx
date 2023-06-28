import Image from "next/image"
import Link from 'next/link'
import Avatar from './_/avatar'
import DateFormatter from './_/date-formatter'
import CoverImage from './_/cover-image'
import type Author from './_/interfaces/author'

type Props = {
  title: string
  coverImage: string
  date: string
  excerpt: string
  author: Author
  slug: string
}

const BlogPost = ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) => {
  
  return (
    <section className="schoolPosts">
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
        <h3 className="">
          <Link
            as={`/posts/${slug}`}
            href="/posts/[slug]"
            className=""
          >
            {title}
          </Link>
        </h3>
        <div>
          Le <DateFormatter dateString={date} />, par&nbsp;<Avatar name={author.name} picture={author.picture} />
        </div>
        <p className="">{excerpt}</p>
      </section>
    </section>
  )
}

export default BlogPost
