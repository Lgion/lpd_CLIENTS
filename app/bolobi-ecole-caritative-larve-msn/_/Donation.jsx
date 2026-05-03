"use client";
import { useState, useEffect, useContext } from "react";
import Image from "next/image"
import { useUser, SignInButton } from "@clerk/nextjs"
import NatureItemsSelector from "./NatureItemsSelector"
import ProjectsSelector from "./ProjectsSelector"

export default function Donation() {
  const { user, isLoaded } = useUser();
  const [selectedType, setSelectedType] = useState(""); // "argent", "nature", "projects", "scolarity"
  const [globalDonations, setGlobalDonations] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGlobalHistory();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserHistory();
    }
  }, [user]);

  const fetchGlobalHistory = async () => {
    try {
      const res = await fetch("/api/donation");
      const data = await res.json();
      if (Array.isArray(data)) setGlobalDonations(data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique global:", error);
    }
  };

  const fetchUserHistory = async () => {
    try {
      const res = await fetch(`/api/donation?user_id=${user.id}`);
      const data = await res.json();
      if (Array.isArray(data)) setUserDonations(data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique utilisateur:", error);
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

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'begin_donation', {
          page_title: 'École Saint Martin'
        });
      }
    }
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (!user) {
      alert("Veuillez vous connecter pour faire un don.");
      return;
    }
    if (!selectedType) {
      alert("Veuillez choisir un type de don.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    data.donation_type = selectedType;
    data.user_id = user.id;

    // Fix pour scolarité : montant fixe si non saisi
    if (selectedType === 'scolarity' && !data.montant) {
      data.montant = 90000;
    }

    if (data.nature_items) {
      data.nature_items = JSON.parse(data.nature_items);
    }

    try {
      const res = await fetch("/api/donation", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'donation_complete', {
            currency: 'XOF',
            value: data.montant ? parseFloat(data.montant) : 0,
            donation_type: data.donation_type
          });
        }
        alert("Merci pour votre don !");
        e.target.reset();
        setSelectedType("");
        fetchGlobalHistory();
        fetchUserHistory();
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
      <section className="school_descr">
        <h4>L'<strong>Oeuvre caritative</strong> du sanctuaire: l'<strong>école Saint Martin de Porrèz</strong></h4>
        <p>L'école Saint Martin de Porrèz est une école primaire gratuite basé à <strong>Bolobi</strong> (après Azaguié sur la route Abidjan-Adzopé). Cette école est en premier lieu à l'endroit des enfants des travailleurs agricoles des alentours de Bolobi (proche village Yakasseme).</p>
        <p>
          Le <b>sanctuaire Notre Dame de Bolobi</b> a <u>ouvert l'école <strong>Saint Martin de Porrez</strong> en septembre 2020</u> avec une classe, le CP1, et 11 élèves.
          L'objectif du sanctuaire est d'ouvrir toutes les classes du primaire à raison d'une nouvelle classe supplémentaire chaque année. L'école a <u>démarré les <b>demandes d'homologation</b> durant l'année scolaire 2025-2026</u>, afin d'être <b>reconnu par l'Etat</b> et exercer dans une plus grande sérénité.
        </p>
        <p>
          Un <b>internat</b> et une <b>cantine</b> sont à la disposition des élèves de l'école, <u>actifs depuis septembre 2021</u>.
          <br /><u>Pour l'internat</u>, nous demandons un financement à auteur de <b>5000F mensuel</b> aux parents d'élèves
          <br /><u>Pour la cantine scolaire</u>, nous nourrissons gratuitement tous les élèves de l'école Saint Martin de Porrèz, moyennant une participation des parents, au début en nature (riz) mais depuis 2026-2027 en espèce. <i>Les internes ont en plus le petit-déjeuner et le dîner.</i>
        </p>
      </section>

      {user && userDonations.length > 0 && (
        <div id="gaveGift" className="gave-gift-section">
          <h4>Vos précédents dons :</h4>
          <div className="gave-gift-grid">
            {userDonations.map((d, index) => (
              <div key={d._id || index} className={`gave-gift-card gave-gift-card--${d.donation_type}`}>
                <div className="gave-gift-card__header">
                  <span className="date">{new Date(d.createdAt).toLocaleDateString()}</span>
                  <span className="type">{d.donation_type}</span>
                </div>
                <div className="gave-gift-card__body">
                  {d.montant > 0 && <div><strong>Montant :</strong> {d.montant.toLocaleString()} FCFA</div>}

                  {d.donation_type === 'scolarity' && (
                    <div className="scolarity-info">
                      {!d.scolarity_student_assigned ? (
                        <div className="student-pending">
                          <div className="student-placeholder-img">👤</div>
                          <p>Sélection de l'élève en cours...</p>
                        </div>
                      ) : (
                        <div className="student-assigned">
                          {d.scolarity_student?.photo && <img src={d.scolarity_student.photo} alt="Elève" className="student-img" />}
                          <p><strong>Elève :</strong> {d.scolarity_student?.prenoms} {d.scolarity_student?.nom}</p>
                          <p><strong>Classe :</strong> {d.scolarity_student?.classe}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {d.donation_type === 'projects' && d.project_id && (
                    <div><strong>Projet :</strong> {d.project_id.title}</div>
                  )}

                  {d.donation_type === 'nature' && d.nature_items && d.nature_items.length > 0 && (
                    <ul>
                      {d.nature_items.map((item, i) => (
                        <li key={i}>{item.quantity} {item.unit} de {item.label}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <button id="do_donation_btn" className="safe" onClick={handleBtn}>FAIRE UN <span>DON</span></button>
      </div>
      <h3>AUX <span>ÉCOLES ST MARTIN DE PORREZ</span>: </h3>
    </article>

    <form id="form_donation" onSubmit={handleSubmit}>
      {!user && (
        <div className="login-prompt">
          <p>Vous devez être connecté pour faire un don.</p>
          <SignInButton mode="modal">
            <button type="button" className="btn-login-donate">🚀 SE CONNECTER POUR DONNER</button>
          </SignInButton>
        </div>
      )}
      <fieldset className="safe" disabled={!user}>
        <h2>Coordonnées de contact: </h2>
        <label htmlFor="nom">Nom *</label>
        <input type="text" id="nom" name="firstname" required defaultValue={user?.lastName || ""} />
        <label htmlFor="prenom">Prénom</label>
        <input type="text" id="prenom" name="lastname" defaultValue={user?.firstName || ""} />
        <label htmlFor="communauté">Communauté ou groupe social?</label>
        <input type="text" id="communauté" name="communauty" />
        <label htmlFor="phone">N° Téléphone *</label>
        <input type="text" id="phone" name="phone_number" required defaultValue={user?.phoneNumbers?.[0]?.phoneNumber || ""} />
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" name="email" defaultValue={user?.primaryEmailAddress?.emailAddress || ""} />
        <label htmlFor="reason">Raison invoqué (pourquoi ce don) ?</label>
        <input type="text" id="reason" name="reason" />

        <div className="donation-choice-grid">
          <div
            className={`donation-card ${selectedType === 'scolarity' ? 'donation-card--active' : ''}`}
            onClick={() => setSelectedType('scolarity')}
          >
            <div className="donation-card__icon">🎓</div>
            <div className="donation-card__content">
              <h3>Scolarité</h3>
              <p>Prendre en charge un élève</p>
            </div>
          </div>

          <div
            className={`donation-card ${selectedType === 'projects' ? 'donation-card--active' : ''}`}
            onClick={() => setSelectedType('projects')}
          >
            <div className="donation-card__icon">🏗️</div>
            <div className="donation-card__content">
              <h3>Projets</h3>
              <p>Financer un projet spécifique</p>
            </div>
          </div>

          <div
            className={`donation-card ${selectedType === 'nature' ? 'donation-card--active' : ''}`}
            onClick={() => setSelectedType('nature')}
          >
            <div className="donation-card__icon">📦</div>
            <div className="donation-card__content">
              <h3>Nature</h3>
              <p>Nourriture, vêtements, fournitures...</p>
            </div>
          </div>

          <div
            className={`donation-card ${selectedType === 'argent' ? 'donation-card--active' : ''}`}
            onClick={() => setSelectedType('argent')}
          >
            <div className="donation-card__icon">💵</div>
            <div className="donation-card__content">
              <h3>Espèce</h3>
              <p>Don financier libre</p>
            </div>
          </div>
        </div>

        <div className={`conditional-fields ${selectedType ? 'conditional-fields--expanded' : ''}`}>

          {selectedType === 'scolarity' && (
            <div className="field-group scolarity-contract">
              <h4>Contrat de Scolarisation</h4>
              <div className="contract-details">
                <p><strong>Bénéficiaire :</strong> N.A (Attribution en cours)</p>
                <p><strong>Classe :</strong> Primaire</p>
                <p><strong>Délai d'attribution estimé :</strong> 2 jours</p>
                <p><strong>Montant des frais de scolarité par enfant:</strong> 90000 FCFA</p>
              </div>
              <p>Si vous etes d'accord avec tout ces tout ces détails, et que vous cliquez le bouton "valider votre don", Nous vous recontacterons d'ici 2 jours pour continuer avec vous votre don à l'école Martin de Porres de Bolobi.</p>
            </div>
          )}

          {selectedType === 'projects' && (
            <div className="field-group">
              <ProjectsSelector onProjectSelect={() => { }} />
              <label htmlFor="money_amount_proj" style={{ marginTop: '15px', display: 'block' }}>Montant du don (FCFA) *</label>
              <div className="input-with-icon">
                <span className="input-prefix">FCFA</span>
                <input type="number" id="money_amount_proj" name="montant" required placeholder="0" />
              </div>
            </div>
          )}

          {selectedType === 'argent' && (
            <div className="field-group field-group--animate">
              <label htmlFor="money_amount_cash">Montant du don (FCFA) *</label>
              <div className="input-with-icon">
                <span className="input-prefix">FCFA</span>
                <input type="number" id="money_amount_cash" name="montant" required placeholder="0" />
              </div>
            </div>
          )}

          {selectedType === 'nature' && (
            <div className="field-group field-group--animate">
              <NatureItemsSelector onItemsChange={() => { }} />
              <label htmlFor="nature_description" style={{ marginTop: '15px', display: 'block' }}>Description supplémentaire du don en nature</label>
              <textarea
                id="nature_description"
                name="nature"
                placeholder="Précisez tout autre détail utile..."
              ></textarea>
            </div>
          )}
        </div>
      </fieldset>

      <fieldset>
        <input type="submit" value={loading ? "Envoi en cours..." : "Valider mon don"} disabled={loading || !user} />
      </fieldset>
    </form>

    <div className="gifts-historic">
      <h3 className="gifts-historic__title">Historique des dons reçus :</h3>
      <ul className="gifts-historic__list">
        {globalDonations.length === 0 ? (
          <div className="gifts-historic__empty">
            Aucun don enregistré jusqu'à maintenant...
          </div>
        ) : (
          globalDonations.slice(0, visibleCount).map((d, index) => (
            <li
              key={d._id || index}
              className={`gifts-historic__item gifts-historic__item--${d.donation_type}`}
            >
              <span className={`gifts-historic__badge gifts-historic__badge--${d.donation_type}`}>
                {d.donation_type === 'argent' ? 'Espèce' : 
                 d.donation_type === 'nature' ? 'Nature' : 
                 d.donation_type === 'scolarity' ? 'Scolarité' : 'Projet'}
              </span>
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
                {d.donation_type === 'scolarity' && (
                  <div className="gifts-historic__field">
                    <span className="gifts-historic__label">Bénéficiaire</span>
                    <span className="gifts-historic__value">
                      {!d.scolarity_student_assigned ? "N.A (Attribution en cours)" : `${d.scolarity_student.prenoms} ${d.scolarity_student.nom}`}
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
        visibleCount < globalDonations.length && (
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
  </section>
}
