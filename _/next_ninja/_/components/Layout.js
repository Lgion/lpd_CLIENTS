import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header>
        <Link href="/">
            <h1>
              <span>Just Add</span>
              <span>Marmite</span>
            </h1>
            <h2>Spread The Joy</h2>
        </Link>
        <Link href="https://next-ninja-livid.vercel.app/">
          Lien vers le site déployé sur vercel
        </Link>
      </header>

      <div className="page-content">
        { children }
      </div>

      <footer>
        <p>Copyright 2021 Just Add Marmite :)</p>
      </footer>

      <style jsx>{`
        header>a{width:100%;}
        header>a:hover{color:white;}
      `}</style>
    </div>
  )
}