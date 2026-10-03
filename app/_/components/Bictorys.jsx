import { useState } from 'react';

export default function TestBictorys() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Appel à votre API backend pour initialiser la charge
            const response = await fetch('/api/checkout/victories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: `TEST-${Date.now()}`, // Identifiant unique généré
                    amount: 1000,                  // Montant du test (ex: 1000 XOF)
                    customerEmail: 'test@example.com',
                    customerPhone: '+2250700000000',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la création du paiement');
            }

            // 2. Redirection vers le lien de paiement fourni par Bictorys
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                throw new Error('URL de paiement introuvable dans la réponse.');
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Test Integration Bictorys</h2>
            <p>Cliquez sur le bouton pour simuler une commande de 1 000 FCFA.</p>

            {error && (
                <div style={{ color: 'red', padding: '10px', background: '#ffe6e6', borderRadius: '4px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <button
                onClick={handlePayment}
                disabled={loading}
                style={{
                    padding: '12px 20px',
                    fontSize: '16px',
                    backgroundColor: loading ? '#ccc' : '#0066cc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '100%',
                }}
            >
                {loading ? 'Initialisation...' : 'Payer 1 000 FCFA'}
            </button>
        </div>
    );
}