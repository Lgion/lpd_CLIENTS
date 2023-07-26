import Link from 'next/link'

type Props = {
  name: string
  picture: string
}

const Avatar = ({ name, picture }: Props) => {
  return (
    <Link href="#" className="author">
      <span className="">{name}</span>
      <img src={picture} className="" alt={name} />
    </Link>
  )
}

export default Avatar
