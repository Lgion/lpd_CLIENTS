import DateFormatter from './date-formatter'

type Props = {
  name?: string
  picture?: string
  date?: string
}

const Avatar = ({ name, picture, date }: Props) => {
  const safeName = name || 'Sanctuaire NDR'
  const safePicture = picture || '/assets/img/logo.png'

  return (
    <div className="post-author-block">
      <img src={safePicture} className="author-avatar" alt={safeName} />
      <div className="author-info">
        <span className="author-name">{safeName}</span>
        <span className="post-date-label">
          Publié le {date ? <DateFormatter dateString={date} /> : 'récemment'}
        </span>
      </div>
    </div>
  )
}

export default Avatar
