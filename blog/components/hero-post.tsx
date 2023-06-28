import Image from "next/image"
import Link from 'next/link'
import Avatar from './avatar'
import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import type Author from '../interfaces/author'

type Props = {
  title: string
  coverImage: string
  date: string
  excerpt: string
  author: Author
  slug: string
}

const HeroPost = ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) => {
  return (
    <section className="heroPost">
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

export default HeroPost
