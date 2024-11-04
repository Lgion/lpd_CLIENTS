import {useContext} from 'react'
import { usePathname } from 'next/navigation'
import Link from "next/link";
import AdminContext from "../stores/adminContext.js"

export default function HeaderAdmin() {

  console.log("\n\n\n\n")
  console.log(usePathname())
  console.log("\n\n\n\n")
  
  let { adminMenuActive, setAdminMenuActive } = useContext(AdminContext)
  , pathname = usePathname()
  pathname = pathname || ""

  if(pathname.indexOf('/admin/school')==0)setAdminMenuActive('school')
  if(pathname.indexOf('/admin/ecommerce')==0)setAdminMenuActive('ecommerce')
  if(pathname.indexOf('/admin/sanctuaire')==0)setAdminMenuActive('sanctuaire')
  if(pathname.indexOf('/admin/blog')==0)setAdminMenuActive('blog')
  // console.log(pathname);
  
  return (
    <header>
      <menu className="mainMenu">
        <li>
          <Link 
            href="/admin/school"
            onClick={()=>{setAdminMenuActive("school")}}
            className={adminMenuActive=="school"?"active":""}
          >
            Ecole St Martin
          </Link>
        </li>
        <li>
          <Link 
            href="/admin/ecommerce"
            onClick={()=>{setAdminMenuActive("ecommerce")}}
            className={adminMenuActive=="ecommerce"?"active":""}
          >
            Ecommerce
          </Link>
        </li>
        <li>
          <Link 
            href="/admin/sanctuaire"
            onClick={()=>{setAdminMenuActive("sanctuaire")}}
            className={adminMenuActive=="sanctuaire"?"active":""}
          >
            Sanctuaire NDR
          </Link>
        </li>
        <li>
          <Link 
            href="/admin/blog"
            onClick={()=>{setAdminMenuActive("blog")}}
            className={adminMenuActive=="blog"?"active":""}
          >
            Blog
          </Link>
        </li>
      </menu>
    </header>
  )
}
