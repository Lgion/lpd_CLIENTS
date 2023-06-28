type Props = {
  name: string
  picture: string
}

const Avatar = ({ name, picture }: Props) => {
  return (
    <figure className="">
      <figcaption className="">{name}</figcaption>
      <img src={picture} className="" alt={name} />
    </figure>
  )
}

export default Avatar
