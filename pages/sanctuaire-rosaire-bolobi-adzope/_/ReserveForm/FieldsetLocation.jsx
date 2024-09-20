import { useState } from "react"




export default function FieldsetLocation({toggleFormNdrImg}) {

    const [isnotZeroParticipant, setIsnotZeroParticipant] = useState(0)
    
    return <>
        <h4 onClick={toggleFormNdrImg}>Choisir le type de logement désiré <br /> (chambre à deux, ou dortoir): </h4>
        <section>
            <div className={isnotZeroParticipant!=false&&"on"}>
                <label htmlFor="participants">Nombre de paticipants total ? *</label>
                <input id="participants" type="number" name="participants" max="250" min="1" 
                    value={isnotZeroParticipant}
                    onChange={e => {
                        setIsnotZeroParticipant(e.target.value)
                        alert(location_dortoir_readlony.value)
                        location_dortoir_readlony.value = e.target.value - individual_room_participants.value
                        document.querySelector("p.location b").innerHTML = parseInt(e.target.value) - parseInt(individual_room_participants.value)
                    }} 
                />
            </div>
            {/* <label htmlFor="dortoirs" className="radioLabel">
                <input id="dortoirs" type="checkbox" name="sleep" />
                <span className="radio"></span>
                <span>Chambre Commune <b>(<b>3000Fcfa</b>/personne la nuité)</b></span>
                <div>
                    <input readonly id="location_dortoir_readlony" value="0" disabled />
                    <label>chambres</label>
                </div>
            </label> */}
            <label htmlFor="chambre" className="radioLabel">
                <input id="chambre" type="checkbox" name="sleep" />
                <span className="radio"></span>
                <span>Chambre Individuel <b>(<b>10000Fcfa</b>/personne la nuité)</b></span>
                {/* <span>chambre</span> */}
                <div>
                    <input 
                        id="individual_room_participants" 
                        type="number" 
                        name="individual_room_participants" 
                        defaultValue={0} 
                        max={isnotZeroParticipant} 
                        min="0" 
                        onChange={e => {
                            document.querySelector("p.location_ b").innerHTML = e.target.value
                            location_dortoir_readlony.value = participants.value - e.target.value
                            document.querySelector("p.location b").innerHTML = parseInt(participants.value) - parseInt(e.target.value)
                        }} 
                    />
                    <label htmlFor="individual_room_participants">chambres</label>
                </div>
            </label>
        </section>
    </>
}
