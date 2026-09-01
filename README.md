# TODOLIST: 
- (admin/sanctuaire) dans l'admin, il faut pouvoir afficher le CA estimé et le CA calculé, de sorte que meme si je n'ai pas validé des réservations, je puisse quand meme avoir un chiffre concernant le CA (donc estimé), avec des indications pour valider celles non encore validées, et un chiffre donnant le CA calculé sur l'ensemble des réservations validées.
- (admin/sanctuaire) il faut pouvoir avoir un inventaire de tout le matériel disponible au sanctuaire pour la maintenance du sanctuaire, 
- (admin/sanctuaire) il faut un composant permettant de catégoriser, d'évaluer, de décrire, et détailler les frais/coûts des réparations et entretiens à effectuer. 
- (dans /blog) un composant pour générer des flyer ou tout autre création à but marketing et publicitaire, composant accéssible à /blog, le reste de la logique de navigation tu t'en charge 
- (blog) Terminer le composant de blog assisté par IA de sorte à ce qu'il soit facilement utilisable dans d'autres projets
- (page)les réservations effectuées doivent générer des notifications à P.Gilbert et Gaston
- (page) les messages envoyés au P.Gilbert depuis le bouton whastapp de la page, doit etre aussi envoyé à Gaston en background (ou à n'importe qui d'autre inscript dans les var d'env pour recevoir le message).
- (accueil admin) permettre de personaliser les infos principales des différentes pages (titre logo, slogan images, paragraphes etc), le tout sur la page d'accueil de l'administration.
- (page) pour le montant de l'avance, il faut à tout prix afficher un montant d'avance arrondi au 1000 près
- le qr code doit bien s'afficher après validation du formulaire, un bouton doit permettre de payer directement l'avance apr wave, et l'email doit contenir: 
    + (page) https://pay.wave.com/m/M_ci_tk7yljaMIDFk/c/ci/?amount= (var d'env: WAVE_LINK)
    => un bouton de paiement wave pour l'avance
    + (page, email) plusieurs numéros de téléphones (gaston, pere gilbert, moi meme cyrille, le numéro vers lequel payer (maman))
    => voic la var d'env listant les numéros de tel: OTHERS_STAFF_WHATSAPP=gaston:0779987454ernestine:0708707719,cyrille:0704763132,maman:0709360672
    + (email) je trouve que l'email n'est toujours pas assez clair concernant le calcul des prix. Il est affiché 1 personnes x 10.000f mais ya pas le calcul avec le nombre de nuit, les détails pour la nourriture aussi ne sont pas clair 
    => peux-tu créer un mise en page professionnel pour les emails de confirmation de réservation, construit un document html5 qui sera vue dans l'email
    + (page) pour le calcul des frais pour la nourriture, il y a chevauhement souvent entre le 1er et dernier jour, trouver une formule si elle n'existe pas déjà pour s'assurer de ne pas duper le client ni nous tirer une balle au pied (je songe à considérer le 1er et dernier jour comme une formule à 2 repas/jour au lieu de 2 formules à 1 repas/jour ou pire 2 formulae à 2 repas/jour si le user avait choisi le plan 2repas/jour)
- 
- (layout) transformer le footer:
    + contact doit afficher le personnel en photo: gaston, p.gilbert, moi, etc
    + transforme l'aspect du footer pour le rendre plus premium. Il ne s'agit pas de changer complètement, mais d'améliorer et le rendre plus professionnel. On ajoutera des éléments, on modifiera l'ordre des choses, on ajoutera des animations, des transitions, etc...
- 



