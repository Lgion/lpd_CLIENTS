"use client"

import dynamic from 'next/dynamic'
// https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
import Link from "next/link";
import React, {useEffect,useMemo} from "react";
import 'leaflet/dist/leaflet.css'

// import MapLeaflet from "./_/MapLeaflet.jsx"


export default function Footer() {
  const Map = React.useMemo(() => dynamic(
    () => import('./_/MapLeaflet'), // replace '@components/map' with your component's location
    { ssr: false } // This line is important. It's what prevents server-side render
  ), [])
  
  // console.log(process)
  if(process.browser){
    // console.log(window)

  }
  useEffect(() => { 
    window.addEventListener('hashchange', function (e) {
      // alert('location changed!');
      // console.log(e)
      // console.log(e.newURL)
      // console.log(e.newURL.substring(e.newURL.indexOf("#!")+2))
      const hash = e.newURL.substring(e.newURL.indexOf("#!")+2)
      console.log(hash)
      this.document.getElementById('footer').childNodes
        .forEach(el=>{el.classList.remove('active')})
      // this.document.getElementById(hash).classList.add("active")
      document.getElementById(hash).classList.add("active")
    });
  }, [])
  return (
    <footer id="footer">
      <ul>
        {
          [
            {id:"qui",title:"Qui sommes-nous ?",content:"Qui somme-nous?"},
            {id:"partenaires",title:"Partenaires",content:"Nos partenaires"},
            {id:"contact",title:"Contactez-nous",content:"Contact"},
            {id:"paiement-livraison",title:"Comment se passe les paiements sur ce siteweb",content:"Paiements & Livraisons"},
            // {id:"livredor",title:"Laisser une appréciation sur le site librairie-puissance-divine.ci",content:"Livre d'or"},
            {id:"webmaster",title:"Découvrez le webmaster de ce site",content:"Powered by"},
          ].map((item,i) => <li className={item.id} key={"mfooter___"+i}>
              <a 
                rel="dofollow" 
                href={"#!"+item.id} 
                title={item.title}
                onClick={e => {
                  const hash = location.href.substring(location.href.indexOf("#!")+2)
                  e.target.parentNode.parentNode.childNodes.forEach(el=>{el.classList.remove('active')})
                  if(hash==(e.target.href.substr(e.target.href.indexOf("#!")+2))){
                    document.getElementById(e.target.href.substr(e.target.href.indexOf("#!")+2)).classList.toggle('active')
                  }else e.target.parentNode.classList.toggle('active')
                }}
              >
                {item.content}
              </a>
          </li>)
        }
      </ul>
      <section id="qui">
          <p>
            Nous sommes un ecommerce religieux chrétien, l&apos;extension virtuelle du
            magasin &quot;
            <a href="index.php?menu=lieu-librairie" target="_blank">
              Librairie puissance Divine
            </a>
            &quot; située aux II plateaux rue des Jardins. À but apostoloque, nous
                    faisons notre possible afin d&apos;affermir les croyants dans la foi.
          </p>
        <br />
        <span className="close"></span>
      </section>
      <section id="contact">
        {/* <img src='' alt="Situation cartographique Librairie religieuse Puissance Divine" title="Librairie Puissance Divine se situe au niveau sur la croix sur cette carte"/> */}
        {/* <iframe
          id="headergmap"
          style={{float:"left",width:"400px",margin:"20px"}}
          src="content/gmap.html"
        ></iframe> */}
        <p>
          <Link target="_blank" href="https://www.google.com/maps/dir/librairies/Librairie+Puissance+Divine,+9245%2B99R,+Rue+des+Jardins,+Abidjan/@5.3559772,-4.0740258,12z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0xfc1eb60c06c0ea3:0xbfc0c8773b1cae8c!2m2!1d-3.9916104!2d5.355982?entry=ttu">Librairie Puissance Divine</Link>,
          Cocody 2 Plateaux, rue des jardins, proche de l&apos;école de police, même
          trottoir que la station Corlay et en face de la pharmacie saint Gil.
        </p>
        <p><u>Téléphone</u> : <a href="#tel:+2250709360672">+225-07-09-36-06-72</a></p>
        <p><u>Email</u> : puissancedivine@gmail.fr</p>
        <p>Nos liens:</p>
        <p>
          <Link
            href="https://www.facebook.com/pages/Librairie-Puissance-Divine/251750848293498?ref=profile"
            title="puissance divine saint-esprit sur facebook"
          >
            Nous suivre sur facebook
          </Link>
        </p>
        <p>
          <Link
            href="https://plus.google.com/117216852454909314352/posts"
            title="puissance divine saint-esprit sur google+"
          >
            Nous suivre sur google+
          </Link>
        </p>
        <p>
          <Link
            href="https://twitter.com/puissancedamour"
            title="puissance divine saint-esprit sur twitter"
          >
            Nous suivre sur twitter
          </Link>
        </p>
        {/* <Map /> */}
        <span className="close"></span>
      </section>
      <section id="paiement-livraison">
        <p>
          Nous acceptons plusieurs modes de <strong>paiement sécucrisé</strong>:
        </p>
        <ul className='safe'>
          <li>par carte bancaire, </li>
          <li>
            par transfert téléphonique (OrangeMoney, MTNMoney et
            Flooz),
          </li>
          <li>
            ou encore par paiement sécurisé online (paypal etc). 
          </li>
        </ul>
        <p>
          Il se peut quelque fois que certains de ces modes de paiement soient temporairement absents.
        </p>
        {/* Nous recommandons fortement l&apos;utilisation du moyen de paiement <Link href='http://fr.wikipedia.org/wiki/Cookie_(informatique)' target='_blank'>sanli CASH</Link>, mise en place par <Link href='http://www.laposte.ci/' target='_blank'>laPoste Côte d'Ivoire</Link>. Ce moyen est autant innovant interopérable sur toute la zone UEMOA (Union &Eacute;conomique et Monétaire Ouest Africaine) grâce au système <Link href='http://www.gim-uemoa.org/page_std.php?id=46' target='_blank'>GIM</Link>.
								<br/> */}
        <hr />
        <p>
          Vos <u>ajouts au panier</u> sont enregistrés comme &nbsp;
          <Link href="" target="_blank">
            cookie
          </Link>
          , et sont valable 5 jours. Après quoi, l&apos;article ajouter est
          automatiquement supprimé de votre panier.
        </p>
        <hr />
        <p>
          Nous utilisons les livreurs indépendants, sans préférence aucune. Les entreprises de livraisons travaillants avec  nous pourrons changer au fil du temps.
          La livraison, sur tout abidjan, est:
        </p>
        <ul className='safe'>
          <li>
            <span className="redd">gratuite</span> pour toutes les commandes au delà de 30.000 Fcfa
          </li>
          <li>
            <span className="redd">de 2.000Fcfa</span> pour toutes les commandes inférieures à 30.000 Fcfa.
          </li>
          <li>
            <span className="redd">de 5.000Fcfa</span> pour toute livraison à l'extérieur d'Abidjan.
          </li>
        </ul>
        <p><u>Pour l'expédition à l'étranger:</u> cela se fera en fonction du contexte</p>
        {/* Les frais de transport pour certains objets, comme les statues en ciment ou poudre de marbre (lourds) sont inclus dans le prix affiché afin de permettre la faisabilité de livraison sur toute la Côte d&apos;Ivoire de tous nos articles en-ligne. */}
        <p>
          Nous expédions vos commandes sous les 72H (3 jours ouverts) après
          reception du paiement.
        </p>
        <hr />
        <p>Ceux-ci sont emballés par nos soins</p>
        <p>
          <u>NB:</u> Il est très important que votre adresse soit la plus précise
          possible.
        </p>
        <span className="close"></span>
      </section>
      <section id="webmaster">
        Webmaster:&nbsp;
        <p>
          <Link href="archist.me" target="_blank">
            Archist Webmaster
          </Link>
        </p>
        <p>
          Navigateur(s) imcompatible(s) avec ce site :<br />
          <Link
            href="https://www.google.fr/chrome/browser/desktop/"
            target="_blank"
            title="Navigateur Google"
          >
            Google Chrome
          </Link>
          <Link
            href="http://www.opera.com/fr"
            target="_blank"
            title="Navigateur Opéra"
          >
            Opéra
          </Link>
          <Link
            href="https://www.mozilla.org/fr/firefox/new/"
            target="_blank"
            title="Navigateur Mozilla"
          >
            Mozilla
          </Link>
        </p>
        <p>
          Ce site est compatible avec tous les appareils ne fonctionnant pas
          sous&nbsp;
          <Link
            href="http://windows.microsoft.com/fr-fr/internet-explorer/download-ie"
            target="_blank"
            title="Navigateur Internet Explorer"
          >
            InternetExplorer
          </Link>
        </p>
        <span className="close"></span>
      </section>
      <section id="livredor">
      </section>
      <section id="partenaires">
        <p>Nous avons pour partenaire les sociétés suivantes:</p>
        {/* <Link href='https://www.sanlishop.ci/' target='_blank'>SanliShop</Link> */}
        <span className="close"></span>
      </section>
    </footer>
  );
}
