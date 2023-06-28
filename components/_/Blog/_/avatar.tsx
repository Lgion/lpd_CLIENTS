import Link from 'next/link'

type Props = {
  name: string
  picture: string
}

const Avatar = ({ name, picture }: Props) => {
  return (
    <Link href="#" className="author">
      <img src={picture} className="" alt={name} />
      <span className="">{name}</span>
    </Link>
  )
}

export default Avatar
