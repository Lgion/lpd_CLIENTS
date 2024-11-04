import {useContext} from 'react'

export default ({ data, type }) => <ul id="school_members">
    {data.map((elt, i) => <li
        key={(type == "teachers" ? "prof" : "eleve") + "_" + i}
        onClick={e => {
            alert('okaddmember')
        }}
    >
        <figure>
            <img src={"/school/" + type + "/" + elt.nom.toLowerCase() + "-" + elt.prenoms.join("-").toLocaleLowerCase() + "/photo.png"} alt={"eleve saint martin de porèz en classe de \"" + elt.current_classe + "\""} />
            <figcaption>{elt.nom} - {elt.prenoms.join(', ')}</figcaption>
        </figure>
        {type == "students" && <>
            <span className={"isInterne" + (elt.isInterne ? " active" : "")}></span>
            <span
            className={"doFeesPaid" + (elt.scolarity_fees ? " euuuuh,c'est très compliqué, il faut que tous les frais soient payé (et donc vérifiés) pour le rendre actif!!!" : "")}
            onClick={e => {
                if (!e.target.classList.contains('active')) {
                    alert('ouafouafouafouaaaaf!!!! LES FRAIS NE SONT PAS TOUS PAAAAAYÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉS!!!!!')
                }
            }}
            ></span>
        </>}
        <section>
            <div className="birth">{elt.naissance}</div>
            <div className="address">{elt.adresse}</div>
            {type == "teachers" && <>
                <div className="phone"><a href={"tel:" + elt.phone}>{elt.phone}</a></div>
                <div className="email"><a href={"mail:" + elt.email}>{elt.email}</a></div>
                </>}
                {type == "students" && <div className="parents">{JSON.stringify(elt.parents)}</div>
            }
        </section>
    </li>)}
</ul>