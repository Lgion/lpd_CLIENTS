import React from "react";

export default function Header() {
  return (
    <header>
      <h1>
        <a id="logo" href="index.php">
          <img
            src="images/ecommerce-chretien-notre-dame-toute-graces.jpg"
            alt="Librairie Puisance Divine, Abidjan, cocody 2 plateaux"
            width="200px"
          />
        </a>
        <a href="index.php?menu=retraites-de-priere-spirituelles-abidjan">
          <img
            src="images/ecommerce-catholique-saint-esprit-Dieu-amour.png"
            alt="Librairie Puisance Divine, Abidjan, cocody 2 plateaux"
          />
        </a>
        Puissance Divine
      </h1>
      <h2>
        <strong>Évangélisation</strong>, <strong>Prière</strong> et{" "}
        <strong>Assistance spirituelle</strong>
      </h2>
      <div id="blogB">
        <a
          href="http://bolobi.ci"
          rel="noreferrer"
          target="_blank"
          title="Blog du Sanctuaire notre Dame du Rosaire"
        >
          Blog <span>bolobi.ci</span>
        </a>
      </div>
      <menu>
        <li className="menu objectifs">
          <a
            className=""
            href="index.php?menu=objectifs-apostoliques"
            title="ÃvangÃ©liser aider rassembler les chrÃ©tiens sanctification saint esprit"
            id="objectifs"
          >
            Objectifs
          </a>
        </li>
        <li className="menu vente">
          <a
            className=""
            href="index.php?menu=vente-en-ligne"
            title="Ecommerce religieux chrÃ©tien catholique: icÃ´ne grottes statues bibles"
            id="vente"
          >
            Vente en ligne
          </a>
        </li>
        <li className="menu enseignements">
          <a
            className=""
            href="index.php?menu=enseignements-spirituels-chretien-catholique"
            title="Enseignements spirituels chrÃ©tien catholique Puissance Divine, jÃ©sus enseigne: l"
            sd=""
            r=""
            par=""
            id="enseignements"
          >
            Enseignements
          </a>
        </li>
        <li className="menu priere">
          <a
            className=""
            href="index.php?menu=retraites-de-priere-spirituelles-abidjan"
            title="Retraites spirituelles, assistance spirituelle, week-ends rosaire sanctuaire dame du rosaire bolobi"
            id="priere"
          >
            Retraites et PriÃ¨res
          </a>
        </li>
        <li className="menu lieux-activites">
          <a
            className=""
            href="index.php?menu=puissance-divine-fraternite-librairie-sanctuaire"
            title="Puissance Divine Abidjan : nos lieux et activitÃ©s religieux chrÃ©tien catholique"
            id="lieux-activites"
          >
            Lieux et ActivitÃ©s
          </a>
        </li>{" "}
      </menu>
      <div>
        <a href="#" onClick='getClass(inscription,"see")'>
          Inscription
        </a>
        <a href="#" onClick='getClass(connexion,"see")'>
          Connexion
        </a>
      </div>
      <form id="connexion" action="index.php?admin=ok" method="post">
        <input type="text" name="user" placeholder="nom utilisateur" />
        <input type="password" name="pwd" placeholder="**********" />
        <input
          style={{
            padding: 0,
            width: "95%",
            height: "50px",
            cursor: "pointer",
            color: "goldenrod",
            fontSize: "1em",
          }}
          type="submit"
          value="ok"
        />
      </form>
      <div
        id="inscription"
        >
          {/*_onMouseOut="this.removeAttribute('class')"
          _onMouseOver="getClass(this,'see')"*/}
        <hr />
        <p>
          Pour toutes les personnes en butte à la maladie, aux maléfices sous
          toutes ses formes, à la sorcellerie ou aux mauvais sorts, nous avons
          un groupe d intercession.
          <br />
          L intercession peut se faire à distance. Mais en cas de nécessité, la
          présence physique pourrait être nécessaire.
          <br />
        </p>
        <ul>
          <li>Vous pouvez soit nous joindre par téléphone au : 47-81-10-92</li>
          <li>Soit par email : puissancedamour@yahoo.fr</li>
          <li>
            Soit par courrier physique à : 08 BP111 Abidjan 08 Côte d Ivoire{" "}
          </li>
        </ul>
        Soit nous présenter votre situation ci-après{" "}
        <b style={{ fontSize: "1.1em", color: "brown" }}>
          avec des informations personnelles (adresse, téléphone, email..)
        </b>
        :
        <form action="index.php" method="post">
          <textarea cols="100" rows="10" name="situation"></textarea>
          <br />
          <input type="submit" value="Envoyer demande d'intercession" />
        </form>
        <p></p>
      </div>{" "}
      <ul id="menu2">
        <li id="demandes">
          <a
            href="#demandes"
            title="Nous intervenons pour vous sur plusieurs plans spirituelle, faite-y une demande chrétienne."
            onClick=""
          >
            Demande Chrétienne ?
          </a>
        </li>
        <li>
          <a
            href="#partenaires"
            title="Découvrez ceux qui compte pour nous en Côte d'ivoire"
            onClick=""
          >
            Partenaires
          </a>
          <ul>
            <li>
              <a href="#" rel="noreferrer" target="_blank">
                void
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a
            href="#blog"
            title="Suivez nos actualités sur notre blog, ou suivez nos actualités en flux rss"
            onClick=""
          >
            Blog et Flux RSS
          </a>
        </li>
        <li>
          <a
            href="index.php?visite_guidee"
            title="découvrez tout sur la Puissance Divine en images et multimédias"
          >
            Visite guidée
          </a>
        </li>
        <li>
          <a href="index.php?menu=livredor">Livre d or</a>
        </li>
        <li id="contacts">
          <a href="#contacts">Nos Contacts</a>
          <ul>
            <li>email</li>
            <li>puissancedamour@gmail.com</li>
            <li>téléphone</li>
            <li>09-36-06-72</li>
            <li>etc</li>
            <li>...</li>
          </ul>
        </li>
      </ul>
      <a
        href="index.php?panier=panier"
        id="paniers"
        title="Accedez au panier ecommerce librairie puissance divine"
      >
        Panier
      </a>
      <aside></aside>
    </header>
  );
}
