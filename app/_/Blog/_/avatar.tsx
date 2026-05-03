import Link from 'next/link'
import DateFormatter from './date-formatter'

type Props = {
  name: string
  picture: string
  date: string
}

const Avatar = ({ name, picture, date }: Props) => {
  return (
    <div className="post-author-block">
      <img src={picture} className="author-avatar" alt={name} />
      <div className="author-info">
        <span className="author-name">{name}</span>
        <span className="post-date-label">
          Publié le <DateFormatter dateString={date} />
        </span>
      </div>
    </div>
  )
}

export default Avatar
