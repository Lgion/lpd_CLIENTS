import Link from "next/link";
import React, {useEffect} from "react";


export default function Footer() {
  // console.log(process)
  if(process.browser){
    console.log(window)
  }
  useEffect(() => { 
    window.addEventListener('hashchange', function (e) {
      // alert('location changed!');
      console.log(e)
      console.log(e.newURL)
      console.log(e.newURL.substring(e.newURL.indexOf("#!")+2))
      const hash = e.newURL.substring(e.newURL.indexOf("#!")+2)
      this.document.getElementById('footer').childNodes.forEach(el=>{el.classList.remove('active')})
      this.document.getElementById(hash).classList.add("active")
    });
  })
  return (
    <footer id="footer">
      <ul>
        <li>
          <a href="#!qui" rel="dofollow" title="Découvrez nous">
            Qui sommes-nous ?
          </a>
        </li>
        <li>
          <a
            href="#!partenaires"
            rel="dofollow"
            title="Les acteurs avec qui nous marchons"
          >
            Partenaires
          </a>
        </li>
        <li>
          <a href="#!contact" rel="dofollow" title="Contactez-nous">
            Contact
          </a>
        </li>
        <li>
          <a
            href="#!paiement-livraison"
            rel="dofollow"
            title="Comment se passe les paiements sur ce siteweb"
          >
            Paiements &amp; Livraisons
          </a>
        </li>
        <li>
          <Link
            href="livredor"
            // rel="dofollow"
            // title="Laisser une appréciation sur le site librairie-puissance-divine.ci"
          >
            Livre d'or
          </Link>
        </li>
        <li>
          <a
            href="#!webmaster"
            rel="dofollow"
            title="Découvrez le webmaster de ce site"
          >
            Webmaster
          </a>
        </li>
      </ul>
      <p id="qui">
          Nous sommes un ecommerce religieux chrétien, l'extension virtuelle du
          magasin "
          <a href="index.php?menu=lieu-librairie" target="_blank">
            Librairie puissance Divine
          </a>
        " située aux II plateaux rue des Jardins. À but apostoloque, nous
        faisons notre possible afin d'affermir les croyants dans la foi.
        <br />
      </p>
      <p id="contact" style={{lineHeight:"5em"}}>
        {/* <img src='' alt="Situation cartographique Librairie religieuse Puissance Divine" title="Librairie Puissance Divine se situe au niveau sur la croix sur cette carte"/> */}
        {/* <iframe
          id="headergmap"
          style={{float:"left",width:"400px",margin:"20px"}}
          src="content/gmap.html"
        ></iframe> */}
        <Link href="index.php?menu=lieu-librairie">Librairie Puissance Divine</Link>,
        Cocody 2 Plateaux, rue des jardins, proche de l'école de police, même
        trottoir que la station Corlay et en face de la pharmacie saint Gil.
        <br />
        <u>Téléphone</u> : 09-36-06-72
        <br />
        <u>Email</u> : puissancedivine@gmail.fr
        <br />
        Nos liens:
        <br />
        <Link
          style={{float:"left",marginRight:"10px"}}
          href="https://www.facebook.com/pages/Librairie-Puissance-Divine/251750848293498?ref=profile"
          title="puissance divine saint-esprit sur facebook"
        >
          Nous suivre sur facebook
        </Link>
        <Link
          style={{float:"left",marginRight:"10px"}}
          href="https://plus.google.com/117216852454909314352/posts"
          title="puissance divine saint-esprit sur google+"
        >
          Nous suivre sur google+
        </Link>
        <Link
          style={{float:"left"}}
          href="https://twitter.com/puissancedamour"
          title="puissance divine saint-esprit sur twitter"
        >
          Nous suivre sur twitter
        </Link>
      </p>
      <div id="paiement-livraison">
        Nous acceptons plusieurs modes de <strong>paiement sécucrisé</strong>:
        par carte bancaire, par transfert téléphonique (OrangeMoney, MTNMoney et
        Flooz) ou encore par paiement sécurisé online (paypal etc). Il se peut
        quelque fois que certains de ces modes de paiement soient absents
        temporairement.
        <br />
        {/* Nous recommandons fortement l'utilisation du moyen de paiement <Link href='http://fr.wikipedia.org/wiki/Cookie_(informatique)' target='_blank'>sanli CASH</Link>, mise en place par <Link href='http://www.laposte.ci/' target='_blank'>laPoste Côte d'Ivoire</Link>. Ce moyen est autant innovant interopérable sur toute la zone UEMOA (Union &Eacute;conomique et Monétaire Ouest Africaine) grâce au système <Link href='http://www.gim-uemoa.org/page_std.php?id=46' target='_blank'>GIM</Link>.
								<br/> */}
        <hr />
        Vos ajouts au panier sont enregistrés comme{" "}
        <Link href="" target="_blank">
          cookie
        </Link>
        , et sont valable 5 jours, après quoi, l'article ajouter est
        automatiquement supprimé de votre panier.
        <hr />
        Notre transporteur principal pour la zone UEMOA est la Poste Côte
        d'Ivoire. Nous acheminons principalement vos commandes par leurs
        services. Nous proposons deux types de frais de transport:
        <br />- <span className="redd">gratuits</span> pour toutes les commandes au
        delà de 30.000 Fcfa
        <br />- <span className="redd">3.000Fcfa</span> pour toutes les commandes
        inférieures à 30.000 Fcfa.
        <br />
        {/* Les frais de transport pour certains objets, comme les statues en ciment ou poudre de marbre (lourds) sont inclus dans le prix affiché afin de permettre la faisabilité de livraison sur toute la Côte d'Ivoire de tous nos articles en-ligne. */}
        Nous expédions vos commandes sous les 72H (3 jours ouverts) après
        reception du paiement.
        <br />
        Ceux-ci sont emballés par nos soins
        <br />
        puis, vous seront livrés par{" "}
        <Link href="http://www.laposte.ci/" target="_blank">
          laPoste Côte d'Ivoire
        </Link>
        , à l'adresse fournie de votre domicile lors de la commande.
        <br />
        <u>NB:</u> Il est très important que votre adresse soit la plus précise
        possible.
      </div>
      <p id="webmaster">
        Webmaster:{" "}
        <Link href="http://gofast.byethost7.com" target="_blank">
          Cyrille ACHI
        </Link>
        <br />
        <br />
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
        <br />
        <br />
        <span>
          Ce site est compatible avec tous les appareils ne fonctionnant pas
          sous{" "}
          <Link
            href="http://windows.microsoft.com/fr-fr/internet-explorer/download-ie"
            target="_blank"
            title="Navigateur Internet Explorer"
          >
            InternetExplorer
          </Link>
        </span>
      </p>
      <p id="partenaires">
        Nous avons pour partenaire les sociétés suivantes:
        <br />
        {/* <Link href='https://www.sanlishop.ci/' target='_blank'>SanliShop</Link> */}
      </p>
    </footer>
  );
}
