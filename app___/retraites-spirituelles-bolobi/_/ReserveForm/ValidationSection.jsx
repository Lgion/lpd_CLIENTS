import Image from 'next/image'

export default function ValidationSection({ reservationData }) {
    console.log(reservationData);
    
    if (!reservationData) return null;

    return (
        <div className="validation-content">
            <h3>Réservation enregistrée avec succès !</h3>
            
            <p className="confirmation-message">
                Votre demande de réservation a été enregistrée. Un email de confirmation 
                contenant toutes les informations a été envoyé à <strong>{reservationData.email}</strong>.
            </p>

            <div className="qr-code-container">
                <Image 
                    src="/qrcode.png" 
                    alt="QR Code de paiement" 
                    width={200} 
                    height={200}
                />
                <p className="qr-info">
                    Scannez ce QR code pour procéder au paiement de l'avance de <strong>{reservationData.montant_avance}F</strong>
                </p>
            </div>

            <div className="payment-reminder">
                <h4>Rappel des montants :</h4>
                <ul>
                    <li>Montant total : <strong>{reservationData.montant_total}F</strong></li>
                    <li>Avance à payer : <strong>{reservationData.montant_avance}F</strong></li>
                    <li>Solde à régler sur place : <strong>{reservationData.montant_total - reservationData.montant_avance}F</strong></li>
                </ul>
            </div>

            <style jsx>{`
                .validation-content {
                    background: #f8f9fa;
                    padding: 2rem;
                    border-radius: 8px;
                    text-align: center;
                }

                h3 {
                    color: #28a745;
                    margin-bottom: 1.5rem;
                }

                .confirmation-message {
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }

                .qr-code-container {
                    margin: 2rem auto;
                    max-width: 300px;
                }

                .qr-info {
                    margin-top: 1rem;
                    color: #666;
                }

                .payment-reminder {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-top: 2rem;
                    text-align: left;
                }

                .payment-reminder h4 {
                    color: #2196f3;
                    margin-bottom: 1rem;
                }

                .payment-reminder ul {
                    list-style: none;
                    padding: 0;
                }

                .payment-reminder li {
                    margin: 0.5rem 0;
                    color: #666;
                }
            `}</style>
        </div>
    );
}
