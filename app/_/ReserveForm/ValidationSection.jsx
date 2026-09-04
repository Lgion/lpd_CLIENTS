import Image from 'next/image'

export default function ValidationSection({ reservationData }) {
    if (!reservationData) return null;

    // Support both API payload ({ reservation, wavePaymentUrl, waveQrPic }) and flat object
    const res = reservationData.reservation || reservationData;
    const avance = parseInt(res.montant_avance, 10) || 0;
    const total = parseInt(res.montant_total, 10) || 0;
    const solde = Math.max(total - avance, 0);

    const baseWaveUrl = process.env.NEXT_PUBLIC_WAVE_LINK || 'https://pay.wave.com/m/M_ci_tk7yljaMIDFk/c/ci/?amount=';
    const waveUrl = reservationData.wavePaymentUrl || (baseWaveUrl ? `${baseWaveUrl}${avance}` : null);
    const qrPic = reservationData.waveQrPic || 'wave_qr.pdf';

    return (
        <div className="validation-content">
            <h3>Réservation enregistrée avec succès !</h3>
            
            <p className="confirmation-message">
                Votre demande de réservation a été enregistrée. Un email de confirmation 
                contenant toutes les informations a été envoyé à <strong>{res.email}</strong>.
            </p>

            <div className="wave-actions-container">
                {waveUrl && (
                    <a 
                        href={waveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="wave-btn"
                    >
                        💳 Payer l'avance de {avance.toLocaleString('fr-FR')} FCFA via Wave
                    </a>
                )}
            </div>

            <div className="qr-code-container">
                <Image 
                    src="/qrcode.png" 
                    alt="QR Code de paiement Wave" 
                    width={200} 
                    height={200}
                />
                <p className="qr-info">
                    Scannez ce QR code ou payez directement via le bouton Wave ci-dessus pour régler l'avance de <strong>{avance.toLocaleString('fr-FR')} FCFA</strong>.
                </p>
                {qrPic && (
                    <p style={{ marginTop: '0.5rem' }}>
                        <a href={`/${qrPic}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0D9FD6', fontSize: '0.9em', textDecoration: 'underline' }}>
                            📄 Télécharger le QR code Wave (PDF / Image)
                        </a>
                    </p>
                )}
            </div>

            <div className="payment-reminder">
                <h4>Rappel des montants :</h4>
                <ul>
                    <li>Montant total : <strong>{total.toLocaleString('fr-FR')} FCFA</strong></li>
                    <li>Avance à payer (arrondie au 1 000 près) : <strong style={{ color: '#28a745' }}>{avance.toLocaleString('fr-FR')} FCFA</strong></li>
                    <li>Solde restant à régler sur place : <strong>{solde.toLocaleString('fr-FR')} FCFA</strong></li>
                </ul>
            </div>

            <style jsx>{`
                .validation-content {
                    background: #f8f9fa;
                    padding: 2rem;
                    border-radius: 12px;
                    text-align: center;
                    margin-top: 1.5rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }

                h3 {
                    color: #28a745;
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                }

                .confirmation-message {
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                    color: #495057;
                }

                .wave-actions-container {
                    margin: 1.5rem 0;
                }

                .wave-btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #1DC7EA 0%, #0D9FD6 100%);
                    color: white;
                    font-weight: 700;
                    font-size: 1.1rem;
                    padding: 14px 28px;
                    border-radius: 10px;
                    text-decoration: none;
                    box-shadow: 0 4px 15px rgba(13, 159, 214, 0.35);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .wave-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(13, 159, 214, 0.5);
                }

                .qr-code-container {
                    margin: 1.5rem auto;
                    max-width: 320px;
                    background: white;
                    padding: 1rem;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }

                .qr-info {
                    margin-top: 0.8rem;
                    color: #6c757d;
                    font-size: 0.95rem;
                }

                .payment-reminder {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin-top: 1.5rem;
                    text-align: left;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }

                .payment-reminder h4 {
                    color: #1a2332;
                    margin-bottom: 0.8rem;
                }

                .payment-reminder ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .payment-reminder li {
                    margin: 0.6rem 0;
                    color: #495057;
                    font-size: 1rem;
                }
            `}</style>
        </div>
    );
}
