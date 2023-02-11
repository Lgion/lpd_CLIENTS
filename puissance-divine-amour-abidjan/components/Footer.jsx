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
    console.log(window)

  }
  useEffect(() => { 
    window.addEventListener('hashchange', function (e) {
      // alert('location changed!');
      // console.log(e)
      // console.log(e.newURL)
      // console.log(e.newURL.substring(e.newURL.indexOf("#!")+2))
      const hash = e.newURL.substring(e.newURL.indexOf("#!")+2)
      this.document.getElementById('footer').childNodes.forEach(el=>{el.classList.remove('active')})
      this.document.getElementById(hash).classList.add("active")
    });
  }, [])
  return (
    <footer id="footer">
      <ul>
        {
          [
            {id:"qui",title:"Qui sommes-nous ?",content:"Découvrez nous"},
            {id:"partenaires",title:"Partenaires",content:"Les acteurs avec qui nous marchons"},
            {id:"contact",title:"Contactez-nous",content:"Contact"},
            {id:"paiement-livraison",title:"Comment se passe les paiements sur ce siteweb",content:"Paiements &amp; Livraisons"},
            {id:"livredor",title:"Laisser une appréciation sur le site librairie-puissance-divine.ci",content:"Livre d'or"},
            {id:"webmaster",title:"Découvrez le webmaster de ce site",content:"Webmaster"},
          ].map((item,i) => <li className={item.id} key={"mfooter___"+i}>
            {item.id!=="livredor" 
              ? <a 
                rel="dofollow" 
                href={"#!"+item.id} 
                title={item.title}
              >
                {item.content}
              </a>
              : <Link
                href="livredor"
                // rel="dofollow"
                title="Laisser une appréciation sur le site librairie-puissance-divine.ci"
              >
                Livre d&apos;or
              </Link>
            }
          </li>)
        }
      </ul>
      <section id="qui">
          Nous sommes un ecommerce religieux chrétien, l&apos;extension virtuelle du
          magasin &quot;
          <a href="index.php?menu=lieu-librairie" target="_blank">
            Librairie puissance Divine
          </a>
          &quot; située aux II plateaux rue des Jardins. À but apostoloque, nous
        faisons notre possible afin d&apos;affermir les croyants dans la foi.
        <br />
        <span className="close"></span>
      </section>
      <section id="contact" style={{lineHeight:"5em"}}>
        {/* <img src='' alt="Situation cartographique Librairie religieuse Puissance Divine" title="Librairie Puissance Divine se situe au niveau sur la croix sur cette carte"/> */}
        {/* <iframe
          id="headergmap"
          style={{float:"left",width:"400px",margin:"20px"}}
          src="content/gmap.html"
        ></iframe> */}
        <p>
          <Link href="index.php?menu=lieu-librairie">Librairie Puissance Divine</Link>,
          Cocody 2 Plateaux, rue des jardins, proche de l&apos;école de police, même
          trottoir que la station Corlay et en face de la pharmacie saint Gil.
        </p>
        <p><u>Téléphone</u> : 09-36-06-72</p>
        <p><u>Email</u> : puissancedivine@gmail.fr</p>
        <p>Nos liens:</p>
        <p>
          <Link
            style={{float:"left",marginRight:"10px"}}
            href="https://www.facebook.com/pages/Librairie-Puissance-Divine/251750848293498?ref=profile"
            title="puissance divine saint-esprit sur facebook"
          >
            Nous suivre sur facebook
          </Link>
        </p>
        <p>
          <Link
            style={{float:"left",marginRight:"10px"}}
            href="https://plus.google.com/117216852454909314352/posts"
            title="puissance divine saint-esprit sur google+"
          >
            Nous suivre sur google+
          </Link>
        </p>
        <p>
          <Link
            style={{float:"left"}}
            href="https://twitter.com/puissancedamour"
            title="puissance divine saint-esprit sur twitter"
          >
            Nous suivre sur twitter
          </Link>
        </p>
        <Map />
        <span className="close"></span>
      </section>
      <section id="paiement-livraison">
        <p>
          Nous acceptons plusieurs modes de <strong>paiement sécucrisé</strong>:
          par carte bancaire, par transfert téléphonique (OrangeMoney, MTNMoney et
          Flooz) ou encore par paiement sécurisé online (paypal etc). Il se peut
          quelque fois que certains de ces modes de paiement soient absents
          temporairement.
        </p>
        {/* Nous recommandons fortement l&apos;utilisation du moyen de paiement <Link href='http://fr.wikipedia.org/wiki/Cookie_(informatique)' target='_blank'>sanli CASH</Link>, mise en place par <Link href='http://www.laposte.ci/' target='_blank'>laPoste Côte d'Ivoire</Link>. Ce moyen est autant innovant interopérable sur toute la zone UEMOA (Union &Eacute;conomique et Monétaire Ouest Africaine) grâce au système <Link href='http://www.gim-uemoa.org/page_std.php?id=46' target='_blank'>GIM</Link>.
								<br/> */}
        <hr />
        <p>
          Vos ajouts au panier sont enregistrés comme{" "}
          <Link href="" target="_blank">
            cookie
          </Link>
          , et sont valable 5 jours, après quoi, l&apos;article ajouter est
          automatiquement supprimé de votre panier.
        </p>
        <hr />
        Notre transporteur principal pour la zone UEMOA est la Poste Côte
        d&apos;Ivoire. Nous acheminons principalement vos commandes par leurs
        services. Nous proposons deux types de frais de transport:
        <ul>
          <li>
            <span className="redd">gratuits</span> pour toutes les commandes au delà de 30.000 Fcfa
          </li>
          <li>
            <span className="redd">3.000Fcfa</span> pour toutes les commandes inférieures à 30.000 Fcfa.
          </li>
        </ul>
        {/* Les frais de transport pour certains objets, comme les statues en ciment ou poudre de marbre (lourds) sont inclus dans le prix affiché afin de permettre la faisabilité de livraison sur toute la Côte d&apos;Ivoire de tous nos articles en-ligne. */}
        <p>
          Nous expédions vos commandes sous les 72H (3 jours ouverts) après
          reception du paiement.
        </p>
        <p>Ceux-ci sont emballés par nos soins</p>
        <p>
          puis, vous serez livré par
          <Link href="http://www.laposte.ci/" target="_blank">
            laPoste Côte d&apos;Ivoire
          </Link>
          , à l&apos;adresse fournie de votre domicile lors de la commande.
        </p>
        <p>
          <u>NB:</u> Il est très important que votre adresse soit la plus précise
          possible.
        </p>
        <span className="close"></span>
      </section>
      <section id="webmaster">
        Webmaster:&nbsp;
        <p>
          <Link href="http://gofast.byethost7.com" target="_blank">
            Cyrille ACHI
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
      <section id="partenaires">
        <p>Nous avons pour partenaire les sociétés suivantes:</p>
        {/* <Link href='https://www.sanlishop.ci/' target='_blank'>SanliShop</Link> */}
        <span className="close"></span>
      </section>
    </footer>
  );
}
