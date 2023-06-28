import {useContext} from 'react'
import Link from "next/link";
import Image from "next/image"
import AuthContext from "../../stores/authContext.js"
import Head from "next/head"
import Nav from '../../components/Nav.jsx'
import styled from 'styled-components'
// import img1 from './../public/img/lieux-activites/bolobi/centre-saint-martin-porres-bolobi-allee-centrale.webp'
// import img2 from './../public/img/lieux-activites/bolobi/centre-saint-martin-porres-bolobi-allee-centrale.webp'
// import img3 from './../public/img/lieux-activites/bolobi/chapelle-sanctuaire-rosaire-bolobi.webp'
// import img4 from './../public/img/lieux-activites/bolobi/users_illustration.webp'
// import img5 from './../public/img/lieux-activites/bolobi/centre-saint-martin-porres-bolobi-allee-centrale.webp'
// import img6 from './../public/img/lieux-activites/bolobi/centre-saint-martin-porres-bolobi-allee-centrale.webp'
// import img7 from './../public/img/lieux-activites/bolobi/chapelle-sanctuaire-rosaire-bolobi.webp'

const MainStyled = styled.main`
img{visibility:hidden;}
`


export default function RetraitesPrieres() {
        const {ok} = useContext(AuthContext)
        , id=3
        , myLoader = ({ src, width, quality }) => {
                return `${src}?w=${width}&q=${quality || 75}`
        }

        return <>
                <Head>
                <title>Create Next Appppp</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
                </Head>


                <main className="priere">
                        
                        <h4 className='lieuxactivite'>Situation géographique: </h4>
                        <p>
                                &Agrave; 30 kilomètres d&apos;Abidjan (Côte d&apos;Ivoire), sur la route Abidjan-Adzopé (panneau indicateur).<i src='/img/lieux-activites/bolobi/centre-saint-martin-porres-bolobi-herbergement-1.webp' alt='activite ong' width='75px'/>
                        </p>
                        <h1>MAP BOLOBI</h1>

                        <hr />
                        <h4>Présentation du site: </h4>
                        <p>
                                Superficie du domaine: 18Ha. <br/>Traversé par une rivière dénommée Bolobi, qui a donné son nom au domaine.
                                {/* <Image
                                        className='zoomable bolobi_situation'
                                        loader={myLoader}
                                        src={img1}
                                        alt='activite ong'
                                        width={75}
                                        style={{position:'absolute',left:'55%'}}
                                /> */}
                        </p>
                        <p style={{padding:'3em 1em'}}>
                                {/* <Image
                                        className='zoomable bolobi_situation'
                                        loader={myLoader}
                                        src={img1}
                                        alt="dsfihdoi fdio hfds"
                                        width={75}
                                        style={{position:'absolute',top:'0',left:'30%'}}
                                /> */}
                                {/* <Image
                                        className='zoomable bolobi_situation'
                                        loader={myLoader}
                                        src={img3}
                                        alt="dsfihdoi fdio hfds"
                                        width={75}
                                        style={{position:'absolute',top:'1em',right:'20%'}}
                                /> */}
                                Site valonné, très venté, en ferme d&apos;exploitation agricole. Le silence et le calme y règnent.
                                {/* <Image
                                        className='zoomable bolobi_situation'
                                        loader={myLoader}
                                        src={img4}
                                        alt="dsfihdoi fdio hfds"
                                        width={75}
                                /> */}
                        </p>
                        <h1>DIAPORAMA PHOTO PRÉSETRNAITON BOLOBI</h1>
                        <hr />
                        <h4>Exploitation: </h4>
                        <p>
                                {/* <Image
                                        className='zoomable bolobi_situation'
                                        loader={myLoader}
                                        src={img1}
                                        alt="dsfihdoi fdio hfds"
                                        width={75}
                                />
                                <Image
                                        className='zoomable bolobi_situation'
                                        loader={myLoader}
                                        src={img1}
                                        alt="dsfihdoi fdio hfds"
                                        width={75}
                                /> */}
                                Palmier à huile, agrumes, poivrier, élevage de mouton, et étang piscicole en projet.
                        </p>
                        <h1>DIAPORAMA EXPLOITATION AGRICOLTE (POIVRE, CACAO, AUTRES)</h1>
                        <hr />
                        <h4>Accueil et hébergement: </h4>
                        <p>
                                {/* <Image
                                        className='zoomable bolobi_situation'
                                        loader={myLoader}
                                        src={img3}
                                        alt="dsfihdoi fdio hfds"
                                        width={75}
                                />
                                <Image
                                        className='zoomable bolobi_situation'
                                        loader={myLoader}
                                        src={img1}
                                        alt="dsfihdoi fdio hfds"
                                        width={75}
                                /> */}
                                Maison du maître des lieux,<br/>
                                Maison des hôtes: 4 chambres, 2salons, 1 cuisine, 1 terrasse, 2 salles d&apos;eau.<br/>
                                Espace d&apos;accueil des visiteurs:<br/>
                                1 bâtiment de 14 studios avec salle d&apos;eau individuelle<br/>
                                3 grandes salles d&apos;hébergement pour les groupes organisés avec salles d&apos;eau extérieures (hommes et femmes)<br/>
                        </p>
                        <h1>DIAPORAMA INSTALLATION D&apos;ACCUEIL (CHAMBRES, RESTAURATION, ...)</h1>
                        <hr />
                        <h4>Restauration: </h4>
                        <p>
                                Espace très aéré, ouvert sur la nature environnante avec toit en chaume (matériaux locaux) offrant l&apos;avantage de garder la fraîcheur même en pleine saison sèche (250m²).
                        </p>
                        <h4>Prière</h4>
                        <p>
                                Une chapelle de prière,<br/>
                                Un sanctuaire marial avec grotte et cheminement du Rosaire (spécial délivrance, guérison et bénédiction),<br/>
                                Des retraites spirituelles (organisées par le Sanctuaire Notre Dame du Rosaire de Bolobi): <br/>
                                - Retraites grégoriennes,<br/>
                                - Retraite au Saint-Esprit,<br/>
                                - Week-ends du Rosaire,
                                !--: chaque week-end, un cheminement du Rosaire spécial délivrance est organisé pour la délivrance, la guérison et la bénédiction, suivi d&apos;une messe le dimanche.--
                                <br/>
                                - Accueil de retraitants (personnes seules, familles ou groupes organisés) en quête de repos et de silence.<br/>
                                - Salle de conférence
                        </p>
                        <h1>DIAPORAMA LIEUX DE PRIÈRE (GROTTE MARIALE, ÉGLISE, ...)</h1>
                        <hr />
                        <h4>Activités caritatives</h4>
                        <p>
                                ÉCOLE POUR LES ENFANTS DE LA PROXIMITÉ
                        </p>
                        <h1>DIAPORAMA ÉCOLIER ÉCOLE ....</h1>
                        <hr />
                </main>
        </>
}