type Props = {
  children?: React.ReactNode
}

const Container = ({ children }: Props) => {
  return <div id="blog_container" className="container mx-auto px-5">
    {children}
  </div>
}

export default Container
