




export default function FieldsetType({toggleFormNdrImg}) {
    <p>Nous vous proposons 2 types générales de réservations, la prière ou le recueillement, chacun sous 3 formes: </p>
    return <>
        <h4 onClick={toggleFormNdrImg}>Quel type d'évènement souhaitez vous organiser à Bolobi ? </h4>
        <section>
            <label htmlFor="pray" className="radioLabel">
                <input id="pray" value="pray" type="radio" name="type_reservation" />
                <span className="radio bottom"></span>
                <span>Prière ponctuelle <span>(100Avé, veillée, recollection, ...)</span></span>
            </label>
            <label htmlFor="retraite" className="radioLabel">
                <input id="retraite" value="retraite" type="radio" name="type_reservation" />
                <span className="radio bottom"></span>
                <span>Retraite de prière <b>de groupe</b> <span>(le weekend généralement)</span></span>
            </label>
            <label htmlFor="individuel" className="radioLabel">
                <input id="individuel" value="individuel" type="radio" name="type_reservation" />
                <span className="radio bottom"></span>
                <span>Retraite de prière <b>individuelle</b></span>
            </label>
            <label htmlFor="celebration" className="radioLabel">
                <input id="celebration" value="celebration" type="radio" name="type_reservation" />
                <span className="radio"></span>
                <span>Célébration <span>(mariage, baptême, conférence, ...)</span></span>
            </label>
            <label htmlFor="repos" className="radioLabel">
                <input id="repos" value="repos" type="radio" name="type_reservation" />
                <span className="radio"></span>
                <span>Repos<br />Détente<br />Convalescence <span>(individuel ou petit groupe)</span></span>
            </label>
            <label htmlFor="longTerm" className="radioLabel">
                <input id="longTerm" value="longTerm" type="radio" name="type_reservation" />
                <span className="radio"></span>
                <span>Vacances / long séjour <span>(maximum 2 mois)</span></span>
            </label>
        </section>
    </>
}
