import { useContext, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from "next/link";
import AdminContext from "../stores/adminContext.js"

export default function HeaderAdmin() {

  let { adminMenuActive, setAdminMenuActive } = useContext(AdminContext)
    , pathname = usePathname() || ""

  useEffect(() => {
    if (pathname === '/admin') setAdminMenuActive('dashboard')
    else if (pathname.indexOf('/admin/sanctuaire') === 0) setAdminMenuActive('sanctuaire')
    else if (pathname.indexOf('/blog') === 0) setAdminMenuActive('blog')
  }, [pathname, setAdminMenuActive])

  return (
    <header className="header-admin-nav">
      <menu className="mainMenu">
        <li>
          <Link
            href="/admin"
            onClick={() => setAdminMenuActive("dashboard")}
            className={adminMenuActive === "dashboard" ? "active" : ""}
          >
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/admin/sanctuaire"
            onClick={() => setAdminMenuActive("sanctuaire")}
            className={adminMenuActive === "sanctuaire" ? "active" : ""}
          >
            ⛪ Sanctuaire NDR
          </Link>
        </li>
        <li>
          <Link
            href="/blog"
            onClick={() => setAdminMenuActive("blog")}
            className={adminMenuActive === "blog" ? "active" : ""}
          >
            📝 Blog
          </Link>
        </li>
        <li>
          <Link
            href="https://school-managment-project.vercel.app/"
            title="Accéder à la page de l'école St Martin de Porres de Bolobi"
            target="_blank"
            rel="noopener noreferrer"
          >
            🏫 École St Martin ↗
          </Link>
        </li>
        <li>
          <Link
            href="https://librairie-puissance-divine.ci/"
            title="Accéder au E-Commerce Chrétien de la Puissance Divine d'Amour d'Abidjan"
            target="_blank"
            rel="noopener noreferrer"
          >
            🛒 E-Commerce ↗
          </Link>
        </li>
      </menu>
    </header>
  )
}
