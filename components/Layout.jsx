import { useEffect, useContext } from 'react'
import Header from "./Header";
import HeaderAdmin from "./HeaderAdmin";
import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from 'next/navigation'

import {AdminContextProvider} from '../stores/adminContext.js'
import AccessDenied from "../pages/admin/AccessDenied"
import Footer from "./Footer";
import Nav from '../components/Nav'
import AuthContext from "../stores/authContext.js"

export default function Layout({ children }) {

  const cleanModal = () => {
    document.querySelector('#modal .modal___header').innerHTML = ""
    // document.querySelector('#modal .modal___main').innerHTML = ""
    // console.log(document.querySelector('#modal .modal___main'));
    document.querySelector('#modal .modal___footer').innerHTML = ""

    const img = document.querySelector('#modal .modal___main .img')
    , content = document.querySelector('#modal .modal___main .content')
    img && img.remove()
    content && content.remove()
  }
  , pathname = usePathname()
  , {isAdmin} = useContext(AuthContext)
  // console.log(pathname);
useEffect(() => {
  console.log(isAdmin);

}, [isAdmin])


  useEffect(() => {

    console.log(pathname);
    console.log(pathname?.indexOf('admin'));
    console.log(pathname?.indexOf('admin') != -1);
    // alert(Array)
    // console.log(document.querySelectorAll('span.close'))
    document.querySelectorAll('span.close').forEach(elt => {
      elt.addEventListener('click', e => {
        // alert("okkk")
        console.log(e.target.parentElement);
        console.log(document.querySelector('#modal'));
        const doParentIsModal = e.target.parentElement == document.querySelector('#modal')
        if (doParentIsModal && pathname?.indexOf('ecommerce')!==-1) 
          cleanModal()
        e.target.parentElement.classList.remove('active')
      })
    })
  }, [])

  return (<>
    <ClerkProvider>

      {((pathname && pathname?.indexOf('admin') == -1) || (!isAdmin && pathname?.indexOf('admin') != -1)) && <>
        <Header />

        <Nav />
      </>}
      {pathname?.indexOf('admin') == -1 && children}



      {(isAdmin && pathname?.indexOf('admin') != -1) && <AdminContextProvider><HeaderAdmin />{children}</AdminContextProvider>}



      {!isAdmin && pathname?.indexOf('admin') != -1 && <AccessDenied />}
      {/* {children} */}

      <Footer />

      <div id="modal">
        <span className="close"></span>
        <div className="modal___header">

        </div>
        <div className="modal___main">

        </div>
        <div className="modal___footer">

        </div>


      </div>

      <style jsx>{`
        header > a {
          width: 100%;
        }
        header > a:hover {
          color: white;
        }
      `}</style>
    </ClerkProvider>
  </>
  );
}
