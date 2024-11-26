



export default function Intro({sommaire,titreH3}) {
    return <>
        <h3 id="forthH3" data-icon="4" data-sommaire={sommaire || titreH3}>{titreH3}</h3>
        <p>Le sanctuaire ND Rosaire de Bolobi est <u>alimenté en électricité par l'énergie solaire</u>, <u><b>un groupe électrogène complète cette source</b> en cas de temps défavorable</u>.</p>
        <p>Les solutions d'hébergement du sanctuaire vont de la chambre individuel-couple, au chambre communes de 4 à 12 personnes, jusqu'aux dortoirs d'environ 80 places. Les chambres et les dortoirs sont protégés par des moustiques. * <i>Aucun accessoire d'hébergement n'est fourni (drap, oreillet, etc), ces effets sont à la charge du pèlerin</i>.</p>
        <p>Enfin, des <b>solutions de restauration</b> sont à disposition des retraitants selon 2 formules:
        </p>
        <ol className='safe'>
            <li>Les retraitants peuvent se faire eux-même la cuisine,</li>
            <li>Les retraitants peuvent <u>commander</u> les repas (3000Fcfa les <u>2 repas + petit déjeuner</u>, ou 1500Fcfa pour <u>1 repas</u>)</li>
        </ol>
    </>
}
