import Link from "next/link";
// import '../styles/MembersList.css'
import "../../../../assets/scss/admin_ai_school.scss"

export default ({ data, type }) => {
    console.log(data);
    
    return <ul id="school_members">
        {data?.map((elt, i) => <li
            key={(type == "teachers" ? "prof" : "eleve") + "_" + i}
            // onClick={e => {
            //     alert('okaddmember')
            // }}
        >
            {
                console.log(elt)
                
            }
        <Link 
            key={"classe_profs_" + i} 
            // href={`/admin/school/${type == "teachers" ? "teacher" : "student"}/${elt.id}`}
            href={`/admin/school/${type == "teachers" ? "teacher" : "student"}/${elt._id}`}
            className="member-link"
        >
            <figure>
                <img src={"/school/" + type + "/" + elt.nom.toLowerCase() + "_" + elt?.prenoms?.join("-").toLocaleLowerCase() +"_"+ elt["photo_$_file"].substring(elt["photo_$_file"].indexOf('.'))} alt={"eleve saint martin de porèz en classe de \"" + elt.current_classe + "\""} />
                <figcaption><span>{elt.nom}</span> - <span>{elt.prenoms?.join(', ')}</span></figcaption>
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
                <div className="birth">{elt["naissance_$_date"]}</div>
                <div className="address">{elt.adresse}</div>
                {type == "teachers" && <>
                    <div className="phone"><a href={"tel:" + elt.phone}>{elt.phone}</a></div>
                    <div className="email"><a href={"mail:" + elt.email}>{elt.email}</a></div>
                    </>}
                    {type == "students" && <div className="parents">{JSON.stringify(elt.parents)}</div>
                }
            </section>
        </Link>
        </li>)}
    </ul>
    }