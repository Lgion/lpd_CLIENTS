import {useEffect} from 'react'
import Header from "./Header";
import Footer from "./Footer";
import Nav from '../components/Nav'

export default function Layout({ children }) {

  const cleanModal = () => {
      document.querySelector('#modal .modal___header').innerHTML = ""
      document.querySelector('#modal .modal___main').innerHTML = ""
      document.querySelector('#modal .modal___footer').innerHTML = ""
  }

  useEffect(() => { 
    // alert(Array)
    console.log(document.querySelectorAll('span.close'))
    document.querySelectorAll('span.close').forEach(elt => {
      elt.addEventListener('click', e => { 
        // alert()
        const doParentIsModal = e.target.parentElement == document.querySelector('#modal')
        if(doParentIsModal)cleanModal()
        e.target.parentElement.classList.remove('active')
      })
    })
  }, [])
  
  return (
    <>
      <Header />

      <Nav />

      {children}

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
    </>
  );
}
