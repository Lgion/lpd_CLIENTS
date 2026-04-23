import Image from 'next/image'

export default function ValidationSection({ reservationData, onClose }) {
    if (!reservationData) return null;

    return (
        <div className="validation-content">
            <div className="validation-header">
                <h3>🎉 Réservation validée !</h3>
                <p>Votre demande a été enregistrée avec succès.</p>
            </div>

            <div className="payment-methods">
                <h4>Procéder au paiement de l'avance</h4>
                <p className="payment-instruction">
                    Veuillez scanner l'un des QR codes ci-dessous pour payer l'avance de <strong>{reservationData.montant_avance} FCFA</strong>.
                </p>

                <div className="qr-grid">
                    <div className="qr-item">
                        <h5>Orange Money</h5>
                        <div className="qr-wrapper">
                            <Image
                                src="/OM.jpg"
                                alt="QR Code Orange Money"
                                width={180}
                                height={180}
                                className="qr-image"
                            />
                        </div>
                        <p className="qr-vendor">Sanctuaire Bolobi</p>
                    </div>

                    <div className="qr-item">
                        <h5>Wave Business</h5>
                        <div className="qr-wrapper">
                            <Image
                                src="/wave_business.png"
                                alt="QR Code Wave Business"
                                width={180}
                                height={180}
                                className="qr-image"
                            />
                        </div>
                        <p className="qr-vendor">Sanctuaire Bolobi</p>
                    </div>
                </div>
            </div>

            <div className="payment-reminder">
                <h4>Rappel de votre réservation</h4>
                <div className="summary-grid">
                    <div className="summary-line">
                        <span>Montant total :</span>
                        <strong>{reservationData.montant_total} FCFA</strong>
                    </div>
                    <div className="summary-line">
                        <span>Avance à payer :</span>
                        <strong className="text-primary">{reservationData.montant_avance} FCFA</strong>
                    </div>
                    <div className="summary-line">
                        <span>Solde sur place :</span>
                        <strong>{reservationData.montant_total - reservationData.montant_avance} FCFA</strong>
                    </div>
                </div>
            </div>

            <button className="modal-close-btn" onClick={onClose}>
                J'ai compris, fermer
            </button>

            <style jsx>{`
                .validation-content {
                    background: #fff;
                    padding: 1.5rem;
                    text-align: center;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .validation-header h3 {
                    color: #207d3a;
                    font-size: 1.6rem;
                    margin-bottom: 0.5rem;
                }

                .validation-header p {
                    color: #666;
                    margin-bottom: 1.5rem;
                }

                .payment-methods {
                    background: #f8faff;
                    border: 1px dashed #cbd5e1;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .payment-methods h4 {
                    margin-top: 0;
                    color: #2a3d5c;
                }

                .payment-instruction {
                    font-size: 0.95rem;
                    color: #475569;
                    margin-bottom: 1.5rem;
                }

                .qr-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .qr-item h5 {
                    margin: 0 0 0.8rem 0;
                    font-size: 1rem;
                    color: #1e293b;
                }

                .qr-wrapper {
                    background: white;
                    padding: 8px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    display: inline-block;
                }

                .qr-vendor {
                    font-size: 0.8rem;
                    color: #64748b;
                    margin-top: 0.5rem;
                }

                .payment-reminder {
                    background: #f1f5f9;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                    text-align: left;
                }

                .payment-reminder h4 {
                    margin: 0 0 0.8rem 0;
                    font-size: 1rem;
                    color: #334155;
                }

                .summary-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .summary-line {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.95rem;
                    color: #475569;
                }

                .text-primary {
                    color: #2563eb;
                }

                .modal-close-btn {
                    width: 100%;
                    padding: 0.8rem;
                    background: #475569;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .modal-close-btn:hover {
                    background: #334155;
                }

                @media (max-width: 500px) {
                    .qr-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
