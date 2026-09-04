export const settingsSlider = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    adaptiveHeight: true
};

export const mainmenu = [
    {
        id: "accueil",
        href: "/",
        title: "Accueil: Librairie religieuse chrétienne Abidjan, Ecommerce chrétien, centre de retraite spirituelle à Bolobi (entre azaguié et yakasseme, sur route d'Adzopé)",
        h2: "DÉCOUVRIR: l'école Martin de Porrès de Bolobi",
        content: "",
        icon: "fa-solid fa-house",
        tagzone: ["librairie", "librairie religieuse", "librairie religieuse chrétienne", "ecommerce chrétien", "sanctuaire bolobi", "retraites spirituelles"],
        titrePage: ["Sanctuaire Notre Dame du Rosaire de Bolobi, vous souhaitent la bienvenue."],
        sns: { "Puissance Divine d'Amour d'Abidjan Cocody 2plateaux rue des jardins": "https://www.facebook.com/genevieve.achi/" },
        search: "librairie+chrétienne+abidjan+cocody+2plateau"
    },
    {
        id: "activites-spirituelles",
        href: "/retraites-spirituelles-bolobi",
        title: "Sanctuaire du Rosaire de Bolobi: activités spirituelles religieuses chrétien catholique",
        h2: "RÉSERVER: au Sanctuaire ND Rosaire de BOLOBI",
        content: "<span>Retraites</span> <span class='keep'>Spirituelles</span>",
        icon: "fa-solid fa-church",
        tagzone: [
            "retraites de prières",
            "activités spirituelles",
            "lieu de loisir abidjan",
            "lieu de détente abidjan",
            "lieu de repos abidjan"
        ],
        titrePage: ["Retraites spirituelles en périphérie d'Abidjan au Sanctuaire Notre Dame du Rosaire de Bolobi"],
        sns: { "Sanctuaire notre Dame du Rosaire de Bolobi": "https://www.facebook.com/abidjan.sanctuaire.rosaire.bolobi/" },
        search: "retraite+spirituelle+sanctuaire+dame+rosaire+bolobi"
    },
    {
        id: "bolobi",
        href: "/bolobi-ecole-caritative-larve-msn",
        title: "Bolobi: école gratuite d'Adzopé, culture du poivre, élevage de mouches soldat noire, activités spirituelles religieuses chrétien catholique et protestant",
        content: "<span>Oeuvres</span> <span class='keep'>Caritatives</span>",
        icon: "fa-solid fa-test",
        tagzone: ["école caritative", "école saint martin de porèz de bolobi"],
        titrePage: ["Les activités religieuses, caritatives, et économiques du sanctuaire de Bolobi, et de l'école St Martin de Porrez"],
        sns: { "École St Martin de Porèz de Bolobi": "https://www.facebook.com/abidjan.puissance.divine/" },
        search: "école+primaire+saint+martin+porès+bolobi+azaguié+yakasseme"
    },
    {
        id: "blog-bolobi",
        href: "/blog",
        title: "Un blog pour vous permettre de tout connaitre de nos activités au sanctuaire de Bolobi.",
        h2: "Blog du Rosaire de Bolobi",
        icon: "fa-solid fa-blog",
        tagzone: [
            "blog",
            "article bolobi",
            "grotte mariale bolobi",
            "notre dame rosaire bolobi"
        ],
        titrePage: ["Le blog du Sanctuaire Notre Dame du Rosaire de Bolobi"],
        sns: { "Le blog Sanctuaire notre Dame du Rosaire de Bolobi": "https://www.facebook.com/abidjan.sanctuaire.rosaire.bolobi/" },
        search: "information+sanctuaire++rosaire+bolobi-blog"
    },
    {
        id: "ecommerce",
        href: "/ecom",
        title: "Ecommerce religieux chrétien catholique: icône grottes statues bibles",
        content: "<span class='keep'>Ecommerce</span> <span>Chrétien</span>",
        icon: "fa-solid fa-cart-shopping",
        tagzone: ["ecommerce", "librarie religieuse", "librairie chrétienne", "publication chrétiennes", "objets de piété", "bibles", "saintes bibles", "icônes", "croix", "encens", "statue mariale", "grotte chrétienne", "chapelets de prière"],
        titrePage: ["Ecommerce libraire puissance divine d'Amour, Cocody 2plateaux rue des jardins"],
        sns: { "librairie puissance divine abidjan rue des jardins": "https://www.facebook.com/abidjan.puissance.divine/", "Maria Valtorta": "https://www.facebook.com/LibrairiePuissanceMariaValtorta/" },
        search: "ecommerce+religieux+chrétien+puissance+divine+amour"
    }
];

export const findByIDMainMenu = (data, id) => data.find((item) => item.id == id);

export default mainmenu;
