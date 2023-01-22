import {useEffect} from 'react'
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {

  useEffect(() => { 
    // alert(Array)
    console.log(document.querySelectorAll('span.close'))
    document.querySelectorAll('span.close').forEach(elt => {
      elt.addEventListener('click', e => { 
        // alert('ok')
        e.target.parentElement.classList.remove('active')
      })
    })
  }, [])
  
  return (
    <>
      <Header />

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
