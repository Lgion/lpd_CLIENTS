# SPEC_08 — Footer Premium avec Photos de l'Équipe et Animations

## Contexte
Le footer actuel (`app/Footer.jsx`, 243 lignes) utilise une structure d'accordéons `<section>` activés par des ancres `#!`. Le contenu est fonctionnel mais basique. L'objectif est de :
1. Ajouter les **photos du personnel** dans la section Contact (Gaston, P. Gilbert, Cyrille, etc.)
2. Rendre le footer **plus premium et professionnel** avec animations et transitions
3. Réorganiser la structure tout en **conservant l'architecture existante**

---

## Fichier principal impacté
- `app/Footer.jsx`
- SCSS existant dans `assets/scss/` (section footer)

---

## 1. Nouvelle Structure du Footer

### Organisation des sections (ordre révisé)
```
┌─────────────────────────────────────────────────────────────────────┐
│                        FOOTER PREMIUM                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │ 🏛️ QUI      │  │ 👥 ÉQUIPE   │  │ 🤝 PARTENAI │  │ ⚡ POWERED │ │
│  │ SOMMES-NOUS │  │ & CONTACT   │  │    RES      │  │    BY     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
│                                                                     │
│  Contenu dynamique selon l'onglet sélectionné                       │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  🌐 Réseaux Sociaux   │  📍 Localisation   │  © 2026              │
│  [FB] [YT] [WA]       │  Bolobi, Adzopé    │  Sanctuaire NDR      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Section "Équipe & Contact" — Photos du Personnel

### Données du personnel
```jsx
const teamMembers = [
  {
    name: "Père Gilbert",
    role: "Directeur du Sanctuaire",
    phone: process.env.NEXT_PUBLIC_DIRECTOR_WHATSAPP || "0779288293",
    photo: "/team/pere-gilbert.jpg", // Photo à fournir dans public/team/
    whatsapp: true
  },
  {
    name: "Gaston",
    role: "Responsable d'accueil",
    phone: "0779987454",
    photo: "/team/gaston.jpg",
    whatsapp: true
  },
  {
    name: "Cyrille",
    role: "Webmaster & Communication",
    phone: "0704763132",
    photo: "/team/cyrille.jpg",
    whatsapp: true
  },
  {
    name: "Ernestine",
    role: "Intendance",
    phone: "0708707719",
    photo: "/team/ernestine.jpg",
    whatsapp: false
  }
];
```

### Composant carte d'équipe
```jsx
function TeamCard({ member }) {
  return (
    <div className="footer-team__card">
      <div className="footer-team__card-photo">
        <Image 
          src={member.photo} 
          alt={member.name}
          width={80} 
          height={80}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
        <div className="footer-team__card-status" /> {/* Pastille verte */}
      </div>
      <div className="footer-team__card-info">
        <h4>{member.name}</h4>
        <span className="footer-team__card-role">{member.role}</span>
        <a href={`tel:+225${member.phone}`} className="footer-team__card-phone">
          📞 +225 {member.phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}
        </a>
        {member.whatsapp && (
          <a 
            href={`https://wa.me/+225${member.phone}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-team__card-wa"
          >
            💬 WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
```

### Structure de la section
```jsx
<section id="contact" className="footer-section footer-section--team">
  <h3 className="footer-section__title">Notre Équipe</h3>
  <div className="footer-team__grid">
    {teamMembers.map((member, i) => (
      <TeamCard key={`team_${i}`} member={member} />
    ))}
  </div>
  
  <div className="footer-contact__details">
    <div className="footer-contact__item">
      <span className="footer-contact__icon">📍</span>
      <div>
        <strong>Sanctuaire Notre Dame du Rosaire</strong>
        <p>Bolobi, Route d'Adzopé (entre Azaguié et Yakasseme)</p>
        <p>Côte d'Ivoire</p>
      </div>
    </div>
    <div className="footer-contact__item">
      <span className="footer-contact__icon">✉️</span>
      <a href="mailto:puissancedamour@yahoo.fr">puissancedamour@yahoo.fr</a>
    </div>
  </div>
</section>
```

---

## 3. Styles SCSS Premium

### Palette de couleurs du footer
```scss
$footer-bg: #0f1419;          // Fond très sombre
$footer-text: #b0b8c4;        // Texte secondaire
$footer-accent: #c9a84c;      // Doré sanctuaire
$footer-card-bg: #1a2332;     // Fond des cartes
$footer-hover: #243044;       // Hover des cartes
$footer-border: rgba(255, 255, 255, 0.06);
```

### Animations et transitions

#### 1. Entrée en fade-in au scroll (Intersection Observer)
```scss
.footer-section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 2. Hover sur les cartes d'équipe
```scss
.footer-team__card {
  background: $footer-card-bg;
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(201, 168, 76, 0.15);
    background: $footer-hover;
  }
  
  &-photo {
    position: relative;
    flex-shrink: 0;
  }
  
  &-status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background: #28a745;
    border-radius: 50%;
    border: 2px solid $footer-card-bg;
    animation: pulse 2s infinite;
  }
  
  &-role {
    display: block;
    font-size: 0.8rem;
    color: $footer-accent;
    margin-top: 2px;
  }
  
  &-phone, &-wa {
    display: inline-block;
    font-size: 0.85rem;
    color: $footer-text;
    text-decoration: none;
    margin-top: 4px;
    transition: color 0.2s;
    
    &:hover {
      color: white;
    }
  }
  
  &-wa {
    color: #25D366;
    margin-left: 12px;
    &:hover { color: #128C7E; }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

#### 3. Barre de navigation du footer (onglets)
```scss
footer#footer > ul {
  display: flex;
  justify-content: center;
  gap: 0;
  padding: 0;
  list-style: none;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid $footer-border;
  
  li {
    a {
      display: block;
      padding: 16px 24px;
      color: $footer-text;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.3px;
      position: relative;
      transition: color 0.3s;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: $footer-accent;
        transition: width 0.3s, left 0.3s;
      }
      
      &:hover {
        color: white;
        &::after {
          width: 100%;
          left: 0;
        }
      }
    }
    
    &.active a {
      color: $footer-accent;
      &::after {
        width: 100%;
        left: 0;
      }
    }
  }
}
```

#### 4. Barre de réseaux sociaux en bas
```scss
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border-top: 1px solid $footer-border;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  
  &__socials {
    display: flex;
    gap: 16px;
    
    a {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      color: $footer-text;
      text-decoration: none;
      font-size: 1.1rem;
      transition: background 0.3s, transform 0.3s;
      
      &:hover {
        background: $footer-accent;
        color: white;
        transform: scale(1.1);
      }
    }
  }
}
```

---

## 4. Éléments Additionnels à Ajouter

### Barre de bas de page (nouveau)
Ajouter après la dernière `<section>`, avant `</footer>` :

```jsx
<div className="footer-bottom">
  <span>© {new Date().getFullYear()} Sanctuaire Notre Dame du Rosaire de Bolobi</span>
  <div className="footer-bottom__socials">
    <a href="https://www.facebook.com/genevieve.achi/" target="_blank" rel="noopener noreferrer" title="Facebook">
      📘
    </a>
    <a href="https://www.youtube.com/@puissancedivineabidjan2568" target="_blank" rel="noopener noreferrer" title="YouTube">
      📺
    </a>
    <a href={`https://wa.me/+2250709360672`} target="_blank" rel="noopener noreferrer" title="WhatsApp">
      💬
    </a>
  </div>
  <span>
    Propulsé par <a href="https://archist.me" target="_blank" rel="noopener noreferrer">Archist</a>
  </span>
</div>
```

---

## 5. Photos de l'équipe — Ressources nécessaires

### Dossier à créer
```
public/team/
├── pere-gilbert.jpg    ← Photo (à fournir par le client)
├── gaston.jpg          ← Photo (à fournir par le client)
├── cyrille.jpg         ← Photo (à fournir par le client)
├── ernestine.jpg       ← Photo (à fournir par le client)
└── placeholder.jpg     ← Photo par défaut si non fournie
```

### Fallback si photo manquante
```jsx
const fallbackPhoto = '/team/placeholder.jpg';
// ou un avatar généré avec les initiales :
<div className="avatar-initials" style={{ background: '#c9a84c' }}>
  {member.name.split(' ').map(n => n[0]).join('')}
</div>
```

---

## 6. Intersection Observer pour animations d'entrée

Ajouter dans `Footer.jsx` :
```jsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );
  
  document.querySelectorAll('.footer-section, .footer-team__card').forEach(el => {
    observer.observe(el);
  });
  
  return () => observer.disconnect();
}, []);
```

---

## Checklist de validation
- [ ] Les photos du personnel sont affichées dans la section Contact
- [ ] Les cartes d'équipe ont un hover effect avec élévation
- [ ] Les numéros de téléphone sont cliquables (lien `tel:`)
- [ ] Les liens WhatsApp ouvrent dans un nouvel onglet
- [ ] L'animation de fade-in au scroll fonctionne sur les sections
- [ ] La barre de navigation du footer a un indicateur animé sous l'onglet actif
- [ ] La barre de bas de page affiche copyright + réseaux sociaux + crédit webmaster
- [ ] Le footer est responsive (cartes d'équipe en colonne sur mobile)
- [ ] Les couleurs et animations sont cohérentes avec la charte du sanctuaire
- [ ] Un placeholder est affiché si une photo d'équipe est manquante
