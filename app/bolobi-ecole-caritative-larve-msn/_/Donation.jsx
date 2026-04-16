"use client";
import { useState, useEffect, useContext } from "react";
import Image from "next/image"
import AuthContext from "../../../stores/authContext.js"
import FormContext from "../../../stores/formContext.js"
import { loadRadios } from '../../_/swappy_radio'
import MoneyGift from "./MoneyGift"
import NatureGift from "./NatureGift"


export default function Donation() {
  const [useMoney, setUseMoney] = useState(false);
  const [useNature, setUseNature] = useState(false);
  const [donations, setDonations] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/donation");
      const data = await res.json();
      if (Array.isArray(data)) setDonations(data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
    }
  };

  const handleBtn = (e) => {
    const form = document.getElementById('form_donation');
    if (form.classList.contains('on')) {
      form.classList.remove('on');
      e.target.innerHTML = "FAIRE UN <span>DON</span>";
      e.target.parentNode.nextElementSibling.style.display = "block";
    } else {
      form.classList.add('on');
      e.target.innerHTML = "Fermer";
      e.target.parentNode.nextElementSibling.style.display = "none";
    }
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (!useMoney && !useNature) {
      alert("Veuillez choisir au moins un type de don (Espèce ou Nature).");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Définir le type de don pour le backend
    data.donation_type = (useMoney && useNature) ? "both" : useMoney ? "argent" : "nature";

    try {
      const res = await fetch("/api/donation", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert("Merci pour votre don !");
        e.target.reset();
        setUseMoney(false);
        setUseNature(false);
        fetchHistory(); // Rafraîchir l'historique
      } else {
        const err = await res.json();
        alert("Erreur : " + (err.error || "Une erreur est survenue"));
      }
    } catch (error) {
      alert("Erreur lors de l'envoi du formulaire");
    } finally {
      setLoading(false);
    }
  };

  return <section>
    <article>
      <h3><u>BOLOBI:</u> Un sanctuaire chrétien, son activité caritative, et de leur financement économique.</h3>
      <Image
        key={"ecole_bolobi_eleves_pose"}
        src={"/img/_/bolobi/croix-bolobi.jpg"}
        alt={"Les élèves de l'école de bolobi posent pour la mamie Mme ACHI"}
        width={200} height={400}
      />
      <section>
        <h4>L'<strong>Oeuvre caritative</strong> du sanctuaire: l'<strong>école Saint Martin de Porrèz</strong></h4>
        <p>L'école Saint Martin de Porrèz est une école primaire gratuite basé à <strong>Bolobi</strong>. Cette école est en premier lieu à l'endroit des enfants des travailleurs agricoles des alentours de bolobi (proche yakasseme).</p>
        <p>
          Le sanctuaire Notre Dame de Bolobi a ouvert l'<strong>école Saint Martin</strong> de Porrez en septembre 2020 avec une classe, le CP1.
          L'objectif du sanctuaire est d'ouvrir toutes les classes du primaire à raison d'une nouvelle classe supplémentaire chaque année. Selon cette objectif nous devrions être reconnu par l'Etat pour l'année scolaire 2025-2026.
        </p>
        <p>
          Un internat et une cantine sont à la disposition des élèves de l'école, actifs depuis septembre 2021.
          <br /><u>Pour l'internat</u>, nous demandons un financement à auteur de <b>5000F mensuel</b> aux parents d'élèves
          <br /><u>Pour la cantine scolaire</u>, nous nourrissons gratuitement tous les élèves de l'école Saint Martin de Porrèz. <i>Les internes ont en plus le petit-déjeuner.</i>
        </p>
      </section>
      <div>
        <button id="do_donation_btn" className="safe" onClick={handleBtn}>FAIRE UN <span>DON</span></button>
      </div>
      <h3>AUX <span>ÉCOLES ST MARTIN DE PORREZ</span>: </h3>
    </article>

    <form id="form_donation" onSubmit={handleSubmit}>
      <fieldset className="safe">
        <h2>Coordonnées de contact: </h2>
        <label htmlFor="nom">Nom *</label>
        <input type="text" id="nom" name="firstname" required />
        <label htmlFor="prenom">Prénom</label>
        <input type="text" id="prenom" name="lastname" />
        <label htmlFor="communauté">Communauté ?</label>
        <input type="text" id="communauté" name="communauty" />
        <label htmlFor="reason">Raison invoqué (pourquoi ce don) ?</label>
        <input type="text" id="reason" name="reason" />
        <label htmlFor="phone">N° Téléphone *</label>
        <input type="text" id="phone" name="phone_number" required />
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" name="email" />

        <div className="donation-choice-grid">
          <div
            className={`donation-card ${useMoney ? 'donation-card--active' : ''}`}
            onClick={() => setUseMoney(!useMoney)}
          >
            <div className="donation-card__icon">💵</div>
            <div className="donation-card__content">
              <h3>Espèce</h3>
              <p>Don financier (virement, espèces...)</p>
            </div>
            <input type="checkbox" name="use_money" checked={useMoney} readOnly style={{ display: 'none' }} />
          </div>

          <div
            className={`donation-card ${useNature ? 'donation-card--active' : ''}`}
            onClick={() => setUseNature(!useNature)}
          >
            <div className="donation-card__icon">📦</div>
            <div className="donation-card__content">
              <h3>Nature</h3>
              <p>Nouriture, vêtements, fournitures...</p>
            </div>
            <input type="checkbox" name="use_nature" checked={useNature} readOnly style={{ display: 'none' }} />
          </div>
        </div>

        <div className={`conditional-fields ${useMoney || useNature ? 'conditional-fields--expanded' : ''}`}>
          {useMoney && (
            <div className="field-group field-group--animate">
              <label htmlFor="money_amount">Montant du don (FCFA) *</label>
              <div className="input-with-icon">
                <span className="input-prefix">FCFA</span>
                <input type="number" id="money_amount" name="montant" required placeholder="0" />
              </div>
            </div>
          )}

          {useNature && (
            <div className="field-group field-group--animate">
              <label htmlFor="nature_description">Description du don en nature *</label>
              <textarea
                id="nature_description"
                name="nature"
                required
                placeholder="Détaillez ici ce que vous souhaitez offrir (ex: 3 sacs de riz, 10 livres de maths CP1...)"
              ></textarea>
            </div>
          )}
        </div>
      </fieldset>

      <fieldset>
        <input type="submit" value={loading ? "Envoi en cours..." : "Valider mon don"} disabled={loading} />
      </fieldset>
    </form>

    <div className="gifts-historic">
      <h3 className="gifts-historic__title">Historique des dons reçus :</h3>
      <ul className="gifts-historic__list">
        {donations.length === 0 ? (
          <div className="gifts-historic__empty">
            Aucun don enregistré jusqu'à maintenant...
          </div>
        ) : (
          donations.slice(0, visibleCount).map((d, index) => (
            <li
              key={d._id || index}
              className={`gifts-historic__item gifts-historic__item--${d.donation_type}`}
            >
              <div className="gifts-historic__row">
                <div className="gifts-historic__field">
                  <span className="gifts-historic__label">Donateur</span>
                  <span className="gifts-historic__value gifts-historic__value--name">
                    {d.firstname} {d.lastname || ""}
                  </span>
                </div>
                <div className="gifts-historic__field">
                  <span className="gifts-historic__label">Date</span>
                  <span className="gifts-historic__value">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {d.communauty && (
                  <div className="gifts-historic__field">
                    <span className="gifts-historic__label">Communauté</span>
                    <span className="gifts-historic__value">{d.communauty}</span>
                  </div>
                )}
              </div>

              <div className="gifts-historic__row">
                {d.montant > 0 && (
                  <div className="gifts-historic__field">
                    <span className="gifts-historic__label">Montant</span>
                    <span className="gifts-historic__value gifts-historic__value--amount">
                      {d.montant.toLocaleString()} FCFA
                    </span>
                  </div>
                )}
                {d.nature && (
                  <div className="gifts-historic__field">
                    <span className="gifts-historic__label">Description</span>
                    <span className="gifts-historic__value gifts-historic__value--nature">
                      {d.nature}
                    </span>
                  </div>
                )}
              </div>

              {d.reason && (<div className="gifts-historic__row" >
                <span className="gifts-historic__label">Raison</span>
                <div className="gifts-historic__reason">
                  {d.reason}
                </div>
              </div>)}
            </li>
          ))
        )}
      </ul>

      {
        visibleCount < donations.length && (
          <button
            type="button"
            className="gifts-historic__more-btn"
            onClick={() => setVisibleCount(prev => prev + 10)}
          >
            Afficher plus de dons
          </button>
        )
      }
    </div >
  </section >
}
