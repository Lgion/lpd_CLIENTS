# TODOLIST: 
            - page sanctuaire: il faut rajouter quelque petites informations: 1° chacun doit venir avec ses draps
            DONE
            - il faut réhabiliter le composant des posts de blog en bas de chaque page
            DONE
            - la page de l'école, il faut que les dons soient mieux structurés: il faut pouvoir y lister la liste des dons déjà reçu, avec les informations de l'origine du don.
            DONE
            - réduire taille images dans /public
            DONE
            - rectifier le composant carousel pour rendre fonctionnel les boutons CRUD, il générait des logs indéfinis et avec des bugs, s'assurer que ce n'est plus le cas
            ALMOST DONE reste juste à vérifier si tout est OK
            - il faut facilter la créaqtion de post de blog, via notamment la capture de photo associé à un vocal pour générer un brouillon (qui pourra plus facilement etre traité plus tard)
                + les ajouts doivent etre lisible (audio et vidéo avec bouton play, images affichées en miniature)
                DONE
            DONE
    - il faut réhabiliter la page école, rectifier tout le design
    WIP manque juste des images et un tout petit peu de 
    - page école, mise en forme: 
        - changer de toute urgence l'image #school_descr>img
        - il faut que le user soit inscrit et connecté pour effectuer un don
        DONE
        - il faut permettre de faire un don selon plusieurs types: 
            + prendre en charge la scolarité d'un élève,
            + soutenir la cantine en vivre
            + financer un projet (construction, matériel, etc) que vous ou nous proposons
            + soutenir l'école par un don en nature
            + soutenir l'école par un don en espèce
        DONE
        - il faut améliorer le rendu des blocs #gaveGift et 
        - les clics sur button.do_donation_btn dans #giveGift_btn génèrent souvent des bug d'affichage, à résoudre!
        il faut regrouper hors de #school_descr, les blocs #gaveGift, #giveGift_btn et #giveGift_btnSubtitle, ainsi que le formulaire #form_donation dans un conteneur section#giftSection
        - il faut améliorer .OurServices.--animated pour le rendre plus moderne (tenter l'animation 3D, et profiter de cet update pour récupérer et retravailler ce composant scss from bootstrap)
        - revisiter une derniere fois le style des éléments qui composent le carousel (les bouton admin CRUD, les fleches de navigation, la couleur des titre, les boutons pour ajouter de nouvelles images, ...)
        - voir comment mieux présenter la section d'introduction aux articles de blog (.blog_category_header)
        - il faut créer un article pour l'évènement de KYNOME 2026
    WIP l'IA a quasi tout fait en quelque prompt, il reste maintenant à vérifier que tout fonctionne correctement.
- carousel: il faut rajouter plus de photos, pour chaque menu et pour tous les thèmes
## Backend: 
            - il faut s'assurer que l'email de confirmation recu après chaque réservation contient toutes les informations nécessaire, ainsi qu'un lien vers le backend pour la gestion des retraites spirituelles
            DONE
            - ajouter GA et GTM ???
            DONE
            - mettre le qr code wave et OM lorsque le user a fini de réserver (réservation enregistré avec succès) et dans l'email
            DONE
            - la page de l'école doit pouvoir afficher les dons, ainsi que les stats de l'école st martin porres (nbre élèves, profs, classes, etc) avec un lien vers l'application de l'école
            ALMOST DONE
            - il faut moi meme rajouter (faire la réservation) les groupes à venir 
            ALMOST DONE
    - toujours sur la page d'accueil, il faut pouvoir afficher des statistique de visites et autres (à la google analytics)
    WIP toutes les stats et balises ne s'affichent pas bien, les clics sur les boutons tracké ne remontent jamais rien
    - il faut une page d'accueil au backend, listant les dernieres actions de tous les menus confondus (retraite, école, librairie, etc)
    WIP
    - améliorer le menu ecommerce
    WIP
- nouveau composant des dons n'est pas MAJ pour etre suivi par GA
- dans l'admin sanctuaire, il faut rappeler au tel tous les groupe dont le nom de la communauté n'est pas connu afin de modifier leur réservation pour y mettre le nom de leur communauté
- il faut créer un vidéo IA expliquant toutes les fonctionnalités de l'application sur la page d'accueil de l'admin
- il me faut rajouter une vidéo explicartive en bas de .admin-howto
- une page d'admin FAQ pour permettre à tout nouveau user de prendre facilement en main l'application, 
    + permettre au user dans cette FAQ de me poser (à moi le dev) directement une question par email
## Ecomerce: 
    - améliorer l'affichage
    WIP
    - il faut une barre de recherche pour faciliter au plus possible les users clients comme employés
    WIP
    - il faut une page dédié pour chaque article du ecocmmerce
    WIP
- revoir le parcours pour intégrer wave et répondre à l'email
## Sanctuaire: 
- il faut MAJ le site dédié au sanctuaire avec les dernieres modifs du site pda