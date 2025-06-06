"use client"

import {useState, useEffect, useContext} from 'react'
import AuthContext from "../../stores/authContext.js"
import CartRecap from "../_/Cart/_/CartRecap.jsx"
import CartUserDatasForm from "../_/Cart/_/CartUserDatasForm.jsx"
import CartHold from "../_/Cart/index.js"
import "../../assets/scss/index_ecom_ai.scss"
import { useUser } from "@clerk/nextjs"

export default function Cart() {
  const {userConnectedDatas} = useContext(AuthContext);
  const { user, isLoaded, isSignedIn } = useUser();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    tel: '',
    adresse: '',
    ville: '',
    // codePostal: '',
    livraison: '',
    paiement: '',
    instructions: ''
  });

  // Hydrate le form avec Clerk si connecté
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setForm(f => ({
        ...f,
        fullName: user.fullName || f.fullName,
        email: user.emailAddresses?.[0]?.emailAddress || f.email,
        tel: user.phoneNumbers?.[0]?.phoneNumber || f.tel
      }));
    }
  }, [isLoaded, isSignedIn, user])
  useEffect(() => {
    // On ne lance la requête que si un email est présent
    if (!form.email) return;
    fetch(`/api/users?email=${encodeURIComponent(form.email)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.user) {
          const u = data.user;
          setForm(f => ({
            ...f,
            fullName: u.fullName || f.fullName,
            tel: u.tel || f.tel,
            adresse: u.options?.adress || f.adresse,
            ville: u.options?.ville || f.ville,
            livraison: u.options?.livraison || f.livraison,
            paiement: u.options?.paiement || f.paiement,
            instructions: u.options?.instructions || f.instructions
          }));
        }
      })
      .catch(() => {/* ignore erreur si user non trouvé */});
  }, [form.email]);
  // Gestion du changement de champ
  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  // Validation intermédiaire (simple)
  const handleNext = () => setStep(step+1);
  const handlePrev = () => setStep(step-1);

  // Soumission finale (à adapter selon backend)
  const handleSubmit = async e => {
    e.preventDefault();
    // Récupère le panier depuis le localStorage (CartLS)
    let cart = [];
    try {
      const CartLS = JSON.parse(window.localStorage.getItem('cart')) || {};
      cart = Object.keys(CartLS).map(item => {
        const parsed = JSON.parse(item);
        return {
          ...parsed,
          qty: CartLS[item]
        }
      });
    } catch (err) {
      alert('Erreur de lecture du panier');
      return;
    }
    if (!cart.length) {
      alert('Votre panier est vide');
      return;
    }
    // Prépare la commande
    const commande = {
      produits: cart,
      date: new Date().toISOString(),
      montant: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
      livraison: form.livraison,
      paiement: form.paiement,
      instructions: form.instructions
    };
    // Prépare le payload utilisateur
    const payload = {
      email: form.email,
      fullName: form.fullName,
      tel: form.tel,
      options: {
        adress: form.adresse,
        ville: form.ville,
        livraison: form.livraison,
        paiement: form.paiement,
        instructions: form.instructions
      },
      commande
    };
    // Envoi à l'API
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Commande envoyée avec succès !');
        window.localStorage.removeItem('cart'); // Vide le panier
        setStep(1);
        setForm({
          fullName: '', email: '', tel: '', adresse: '', ville: '', livraison: '', paiement: '', instructions: ''
        });
      } else {
        alert('Erreur lors de la commande : ' + (data.error || '')); 
      }
    } catch (err) {
      alert('Erreur lors de la connexion au serveur.');
    }
  };


  return (
    <main className="cart-ai-checkout">
      <div className="cart-ai-checkout__container">
        <section className="cart-ai-checkout__recap">
          <CartRecap />
        </section>
        <section className="cart-ai-checkout__form">
          <div className="cart-ai-steps">
            <button className={step===1 ? 'active' : ''} onClick={()=>setStep(1)}>1. Infos client</button>
            <button className={step===2 ? 'active' : ''} onClick={()=>form.fullName && form.email && setStep(2)} disabled={!form.fullName || !form.email}>2. Livraison</button>
            <button className={step===3 ? 'active' : ''} onClick={()=>form.livraison && setStep(3)} disabled={!form.livraison}>3. Paiement</button>
          </div>
          <form className="cart-ai-form" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="cart-ai-step-content">
                <h2>Informations client</h2>
                <label>Nom complet*
                  <input name="fullName" value={form.fullName} onChange={handleChange} required />
                </label>
                <label>Email*
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </label>
                <label>Téléphone
                  <input name="tel" value={form.tel} onChange={handleChange} />
                </label>
                <button type="button" className="btn-primary" onClick={handleNext} disabled={!form.fullName || !form.email}>Suivant</button>
              </div>
            )}
            {step === 2 && (
              <div className="cart-ai-step-content">
                <h2>Livraison</h2>
                <label>Adresse*
                  <input name="adresse" value={form.adresse} onChange={handleChange} required />
                </label>
                <label>Ville*
                  <input name="ville" value={form.ville} onChange={handleChange} required />
                </label>
                {/* <label>Code postal*
                  <input name="codePostal" value={form.codePostal} onChange={handleChange} required />
                </label> */}
                <label>Mode de livraison*
                  <select name="livraison" value={form.livraison} onChange={handleChange} required>
                    <option value="">Choisir...</option>
                    <option value="retrait">Retrait en boutique</option>
                    <option value="colissimo">Colissimo (France)</option>
                    <option value="express">Express (Abidjan)</option>
                  </select>
                </label>
                <label>Instructions (optionnel)
                  <textarea name="instructions" value={form.instructions} onChange={handleChange} />
                </label>
                <div className="cart-ai-nav-btns">
                  <button type="button" className="btn-secondary" onClick={handlePrev}>Retour</button>
                  <button type="button" className="btn-primary" onClick={handleNext} disabled={!form.adresse || !form.ville || !form.livraison}>Suivant</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="cart-ai-step-content">
                <h2>Paiement</h2>
                <label>Méthode de paiement*
                  <select name="paiement" value={form.paiement} onChange={handleChange} required>
                    <option value="">Choisir...</option>
                    <option value="cb">Carte bancaire</option>
                    <option value="paypal">PayPal</option>
                    <option value="especes">Espèces à la livraison</option>
                  </select>
                </label>
                <div className="cart-ai-nav-btns">
                  <button type="button" className="btn-secondary" onClick={handlePrev}>Retour</button>
                  <button type="submit" className="btn-primary" disabled={!form.paiement}>Valider la commande</button>
                </div>
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}

