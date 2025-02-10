"use client"

import { useState, useEffect } from "react"

export default function FieldsetLocation({toggleFormNdrImg, onParticipantsChange, onIndividualRoomChange, participants, individualRoomParticipants, handleFieldsetValidation}) {
    const [isnotZeroParticipant, setIsnotZeroParticipant] = useState(0)
    const [isApproximateCount, setIsApproximateCount] = useState(false)

    const onChangeParticipants = (e,alt) => {
        setIsnotZeroParticipant(alt||participants)
        onParticipantsChange(alt||e.target.value)
    }

    const handleApproximateChange = (value) => {
        const participantsMap = {
            '10-30': 15,
            '30-50': 40,
            '50-100': 75,
            '100+': 120
        }
        onParticipantsChange(participantsMap[value])
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
            <div className="checkApproxim">
                <label>
                    <div>SI VOUS<u> NE SAVEZ PAS,</u> COCHEZ CETTE CASE</div>
                    <div>PUIS, DONNEZ JUSTE UNE FOURCHETTE APPROXIMATIVE DU<u> NOMBRE DE PARTICIPANTS.</u></div>
                    <input 
                        type="checkbox" 
                        checked={isApproximateCount}
                        onChange={(e) => setIsApproximateCount(e.target.checked)}
                    />
                    <i><b>*</b> Estimation <strong>{isApproximateCount ? "approximative" : "précise"}</strong> du nombre de participants <b>active</b></i>
                </label>
            </div>

            <div className={`${isnotZeroParticipant!=false?"on":""} ${isApproximateCount ? 'hidden' : ''}`}>
                <label htmlFor="participants"><b><u>Précisez</u></b> le nombre exact de participants *</label>
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

            <div className={`approxim-number-input ${!isApproximateCount ? 'hidden' : ''}`}>
                <label><b><u>Sélectionnez</u></b> une estimation du nombre de participants *</label>
                <div>
                    {[
                        { value: '10-30'},
                        { value: '30-50'},
                        { value: '50-100'},
                        { value: '100+' }
                    ].map(option => (
                        <label key={option.value} className="radio-label">
                            <input
                                type="radio"
                                name="approximateCount"
                                value={option.value}
                                onChange={(e) => handleApproximateChange(e.target.value)}
                            />
                            <div>entre <span>{option.value}</span> participants</div>
                        </label>
                    ))}
                </div>
            </div>

            <label htmlFor="chambre" className="radioLabel safe">
                <span>Chambre Individuel <b>(<b>10000Fcfa</b> la nuité)</b></span>
                <div>
                    <input 
                        id="individual_room_participants" 
                        type="number" 
                        name="individual_room_participants" 
                        max={participants} 
                        min="0" 
                        value={individualRoomParticipants}
                        onChange={e => {
                            onIndividualRoomChange(e.target.value)
                        }} 
                    />
                    <label htmlFor="individual_room_participants">chambres</label>
                </div>
            </label>
        </section>
        <button 
          className="validate-button"
          onClick={(e) => {
            e.preventDefault();
            
            const totalParticipants = parseInt(document.querySelector('#participants')?.value || '0');
            const individualRooms = parseInt(document.querySelector('#individual_room_participants')?.value || '0');
            
            // Vérifier si le nombre total de participants est valide
            if (totalParticipants <= 0) {
              alert('Le nombre total de participants doit être supérieur à 0');
              return;
            }
            
            // Vérifier si le nombre de chambres individuelles est valide
            if (individualRooms < 0) {
              alert('Le nombre de chambres individuelles ne peut pas être négatif');
              return;
            }
            
            // Vérifier si le nombre de chambres individuelles n'excède pas le nombre total de participants
            if (individualRooms > totalParticipants) {
              alert('Le nombre de chambres individuelles ne peut pas être supérieur au nombre total de participants');
              return;
            }
            
            // Si toutes les validations passent
            handleFieldsetValidation('location');
          }}
        >
          Valider
        </button>
    </>
}
