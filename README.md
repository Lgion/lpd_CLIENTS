
- il manque le dossier "/public/img/"
- faire npm install --legacy-peer-deps
# FIGMA MOCKUP & STYLE-GUIDE
https://www.figma.com/design/MaXfDGH8SAk1O6rzkhgK5r/LPD_CLIENT's-style-guide?node-id=1-37&t=wKYJ3xmZT2qIjTEc-0
# TODO LIST:
## HOMEPAGE:
### HEADER TAG
- combinaison gagnante à trouver entre:
    1. le header:before/:after, 
    2. et les images dans le h1 (surtout le vierge, l'autre a une transparence qu'on peut déjà exploité, mais pas la vierge)
- l'image du centre dans le h1 doit etre redéfinie pour chaque page
- menu.SNS: créer les liens si nécessaire, et les faire relier au lien adéquate de  menu. Il faudra définir une politique sur la hiérarchie ou le sens des liens sur chaque SNS (youtube, insta, x, fb, tiktok, whatsapp, ...legion xD)
- menu.mainMenu a encore quelque chose de dégueulasse, il faut trouver quoi rajouter/retirer pour améliorer son aspect visuel
- les buttons cart et log/sign/in: juger s'il est bon de les déplacer, ou de changer leur apparence. Il faut avec #panier prendre en considération ul.miniCart
- aside:
    1. créer une page pour rassembler MV dessus, et rediriger au moins vers cette page au clic
    2. rediriger vers la chaine youtube du sanctuaire (la créer si nécessaire)
- définir un slogan pour chaque page, et l'insérer dans h2.page_slogan
# RECONSTRUCTION DE [pda](http://puissance-divine.ci/)

Je passe donc de la vielle et 1ère version faite en PHP ([code visible sur ce repo](https://github.com/webdev-archist/PRODUCTION_pda)),

À une toute nouvelle version faite avec [NextJS](https://nextjs.org/), le framework React tendance du moment.

# OLD TODO: 
J'ai écrit quelque part dans un cahier les modifications à faire pour la nouvelle version, qu'il faut absolument que je numérise et mette sur la branche master de ce projet

Aussi, il faudrait reprendre le repo de l'ancienne version, et transposer le code de cette nouvelle version là-bas, ceci afin d'avoir un système de version pour ce projet (v1.0 pour l'ancienne version, et v2.0.1 pour débuter cette nouvelle version)

Car bien sûr il devra y avoir des modifications a apporter (en plus des améliorations techniques donc): 
- Il n'y aura plus certains menu, comme "enseignements".,
- D'autre menus devront être réhaménager, la plus part à vrai dire (mais surtout pour les réservations au sanctuaire du Rosaire),
- Enfin d'autres encore devront être créés (un blog pour mieux présenter bolobi et le faire connaître ainsi que le faire vivre sur les réseaux sociaux afin d'avoir des stratégies de notoriété sur le web dans le secteur religieux bien sûr)



---
---
---
---
---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
