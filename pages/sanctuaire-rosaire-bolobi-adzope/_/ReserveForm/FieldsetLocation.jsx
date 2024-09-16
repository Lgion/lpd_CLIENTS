



export default function FieldsetLocation() {
    return <>
        <h4>Choisir le type de logement désiré <br /> (chambre à deux, ou dortoir): </h4>
        <label htmlFor="participants">Nombre de paticipants total ? *</label>
        <input id="participants" type="number" name="participants" max="250" min="1" onChange={e => {
            document.querySelector("p.location b").innerHTML = parseInt(e.target.value) - parseInt(individual_room_participants.value)
        }} />
        <section>
            <label htmlFor="dortoirs" className="radioLabel">
                <input id="dortoirs" type="checkbox" name="sleep" />
                <span className="radio"></span>
                <span>Chambre Commune <b>(<b>3000Fcfa</b>/personne la nuité)</b></span>
                {/* <span className="oko">dortoire</span> */}
            </label>
            <label htmlFor="chambre" className="radioLabel">
                <input id="chambre" type="checkbox" name="sleep" />
                <span className="radio"></span>
                <span>Chambre Individuel <b>(<b>10000Fcfa</b>/personne la nuité)</b></span>
                {/* <span>chambre</span> */}
                <input id="individual_room_participants" type="number" name="individual_room_participants" defaultValue={0} max="10" min="0" onChange={e => {
                    document.querySelector("p.location_ b").innerHTML = e.target.value
                    document.querySelector("p.location b").innerHTML = parseInt(participants.value) - parseInt(e.target.value)
                }} />
            </label>
        </section>
    </>
}
