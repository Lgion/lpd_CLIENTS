export default function FieldsetPayment({ participants, individual_room_participants, dateDiffDuAu, mealPlan }) {
    const PRIX_NUIT_COMMUNE = 3000;
    const PRIX_NUIT_INDIVIDUELLE = 10000;
    const PRIX_REPAS_COMPLET = 3000; // 2 repas + petit déjeuner
    const PRIX_REPAS_UNIQUE = 2000;  // 1 repas + petit déjeuner
    
    // Calcul du nombre de nuits
    const nombreNuits = dateDiffDuAu()?.day || 0;
    
    // Calcul du nombre de personnes en chambre commune
    const participantsCommune = participants - (individual_room_participants || 0);
    
    // Calcul des montants pour l'hébergement
    const montantChambresCommunes = participantsCommune * PRIX_NUIT_COMMUNE * nombreNuits;
    const montantChambresIndividuelles = (individual_room_participants || 0) * PRIX_NUIT_INDIVIDUELLE * nombreNuits;
    
    // Calcul du montant des repas
    let montantRepas = 0;
    if (mealPlan === 1) {
        montantRepas = participants * PRIX_REPAS_UNIQUE * nombreNuits;
    } else if (mealPlan === 2) {
        montantRepas = participants * PRIX_REPAS_COMPLET * nombreNuits;
    }
    
    // Calcul du montant total
    const montantTotal = montantChambresCommunes + montantChambresIndividuelles + montantRepas;
    
    // Calcul de l'avance (20% du total)
    const montantAvance = Math.ceil(montantTotal * 0.2);

    return (
        <fieldset className="payment">
            <h4>Informations de paiement</h4>
            
            <div className="payment-details">
                <h5>Détail de votre séjour :</h5>
                <ul>
                    <li>Durée : {nombreNuits} nuit{nombreNuits > 1 ? 's' : ''}</li>
                    {participantsCommune > 0 && (
                        <li>
                            Chambres communes: {participantsCommune} personne{participantsCommune > 1 ? 's' : ''} 
                             × {PRIX_NUIT_COMMUNE}F/nuit × {nombreNuits} nuit{nombreNuits > 1 ? 's' : ''} 
                            = {montantChambresCommunes}F
                        </li>
                    )}
                    {individual_room_participants > 0 && (
                        <li>
                            Chambres individuelles: {individual_room_participants} personne{individual_room_participants > 1 ? 's' : ''} 
                             × {PRIX_NUIT_INDIVIDUELLE}F/nuit × {nombreNuits} nuit{nombreNuits > 1 ? 's' : ''} 
                            = {montantChambresIndividuelles}F
                        </li>
                    )}
                    {mealPlan > 0 && (
                        <li>
                            Restauration: {participants} personne{participants > 1 ? 's' : ''} 
                            × {mealPlan === 1 ? PRIX_REPAS_UNIQUE : PRIX_REPAS_COMPLET}F/jour × {nombreNuits} jour{nombreNuits > 1 ? 's' : ''} 
                            = {montantRepas}F
                            {mealPlan === 1 ? ' (1 repas + petit déjeuner)' : ' (2 repas + petit déjeuner)'}
                        </li>
                    )}
                </ul>

                <div className="total">
                    <p>Montant total du séjour: <strong>{montantTotal}F</strong></p>
                    <p>Avance requise (20%): <strong>{montantAvance}F</strong></p>
                </div>

                <div className="payment-info">
                    <p>
                        <strong>Processus de réservation:</strong>
                    </p>
                    <ol>
                        <li>Après validation de ce formulaire, vous recevrez un email contenant un QR code.</li>
                        <li>Ce QR code vous permettra de procéder au paiement de l'avance de {montantAvance}F.</li>
                        <li>Votre réservation sera confirmée une fois l'avance reçue.</li>
                        <li>Le solde de {montantTotal - montantAvance}F sera à régler sur place.</li>
                    </ol>
                </div>
            </div>

            <style jsx>{`
                .payment-details {
                    background: #f5f5f5;
                    padding: 1rem;
                    border-radius: 8px;
                    margin: 1rem 0;
                }

                .payment-details ul {
                    list-style: none;
                    padding-left: 0;
                }

                .payment-details li {
                    margin: 0.5rem 0;
                    color: #666;
                }

                .total {
                    margin: 1rem 0;
                    padding: 1rem;
                    background: #fff;
                    border-radius: 4px;
                    border-left: 4px solid #2196f3;
                }

                .total p {
                    margin: 0.5rem 0;
                }

                .payment-info {
                    margin-top: 1rem;
                    padding: 1rem;
                    background: #e3f2fd;
                    border-radius: 4px;
                }

                .payment-info ol {
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                }

                .payment-info li {
                    margin: 0.5rem 0;
                    color: #444;
                }
            `}</style>
        </fieldset>
    );
}
