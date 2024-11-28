import { useState, useEffect } from "react"

export default function FieldsetLocation({toggleFormNdrImg, onParticipantsChange, onIndividualRoomChange, participants, individualRoomParticipants}) {

    const [isnotZeroParticipant, setIsnotZeroParticipant] = useState(0)
    , onChangeParticipants = (e,alt) => {
        setIsnotZeroParticipant(alt||participants)
        onParticipantsChange(alt||e.target.value)
    }

    useEffect(()=>{

        // document.querySelector('article.dates b').innerHTML = dateDiffDuAu()
    },[])
    
    
    return <>
        <h4 onClick={toggleFormNdrImg}>Choisir le nombre de participants, ainsi que le type de logement désiré <br /> (chambre indiv., ou dortoir): </h4>
        <p>Les Chambres individuelles et dortoirs sont <u>protégés par moustiquaires</u></p>
        <ul>
            <li><u>Chambre individuelle (<b>10.000F</b> / nuit):</u> ventilateur - douche - lavabo - wc</li>
            <li><u>Chambre en dortoir (<b>3.000F</b> / nuit):</u> 10 matelas double - ventilateurs plafond - wc & sdb commun</li>
        </ul>
        <section>
            <div className={isnotZeroParticipant!=false?"on":""}>
                <label htmlFor="participants"><b><u>Estimez</u></b> nombre de paticipants total ? *</label>
                <div className="custom-number-input">
                    <button type="button" onClick={e => {onChangeParticipants(e,parseInt(participants)-1)}}>-</button>
                    <input 
                        id="participants" 
                        type="number" 
                        name="participants" 
                        max="250" 
                        min="1" 
                        value={participants}
                        onChange={onChangeParticipants} 
                    />
                    <button type="button" onClick={e => {onChangeParticipants(e,parseInt(participants)+1)}}>+</button>
                </div>

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
            <label htmlFor="chambre" className="radioLabel safe">
                {/* <input id="chambre" type="checkbox" name="sleep" /> */}
                {/* <span className="radio"></span> */}
                <span>Chambre Individuel <b>(<b>10000Fcfa</b>/personne la nuité)</b></span>
                {/* <span>chambre</span> */}
                <div>
                    <input 
                        id="individual_room_participants" 
                        type="number" 
                        name="individual_room_participants" 
                        // defaultValue={0} 
                        max={participants} 
                        min="0" 
                        value={individualRoomParticipants}
                        onChange={e => {
                            onIndividualRoomChange(e.target.value)
                        }} 
                    />
                </div>
                <label htmlFor="individual_room_participants">chambres</label>
            </label>
        </section>
    </>
}
