export const ecole_classes = [
    // {
    //     id: ""
    //     , professeur: ""
    //     , eleves: ""
    //     , annee: ""
    //     , niveau: ""
    //     , photo: ""
    //     , alias: ""
    //     , homework: ""
    //     , absences: ""
    //     , moyenne_composition: ""
    //     , moyenne_trimetriel: ""
    //     , commentaires: ""
    // }
    {
        id: "1"
        , professeur: ["1"]
        , eleves: ["1","2"]
        , annee: "2022-2023"
        , niveau: "CP1"
        , alias: "A"
        , photo: "cp1_A.png"
        , homework: {"12-10": {maths:"Exercie math, page 12 exo 3 et 4"}, "16-10": {francais: "faire un résumé de 100 mots du livre \"Bla blabla\"", geo: "dessiner la carte de la CI, et ses régions"}}
        // , absences: {"1":}
        , compositions: {"2023": ["12","08","09","14.5"], "2022": ["12","08","09","14.5"], "2021": ["12","08","09","14.5"], }
        , moyenne_trimetriel: ["12","13","10"]
        , commentaires: [{"2023-11-12": "l'ambiance s'est enttement amélioré depuis quelque semaine"}]
    }
]


export const ecole_eleves = [
    // {
    //     id: ""
    //     , current_classe: ""
    //     , nom: ""
    //     , prenoms: [""]
    //     , naissance: ""
    //     , adresse: ""
    //     , parents: {mere: "", pere: "", phone: ""}
    //     , photo: ""
    //     , scolarity_fees: {"YYYY": {}}
    //     , bolobi_class_history: {"YYYY": ""}
    //     , school_history: {"YYYY": ""}
    //     , notes: {"matiere": {"timestamp": ""}}
    //     , compositions: {"YYYY": []}
    //     , absences: ["YYYY-MM-DD"]
    //     , moyenne_trimetriel: {"YYYY": ["", "", ""]}
    //     , bonus: [{"timestamp": ""}]
    //     , manus: [{"timestamp": ""}]
    //     , isInterne: false
    //     , commentaires: {"timestamp": ""}
    //     , documents: [""]
    // }
    {
        id: "1"
        , current_classe: "CP1-A"
        , nom: "Aladin"
        , prenoms: ["Fabrice", "Jean"]
        , naissance: "01-01-2015"
        , adresse: "yakasseme, proche boutique MTN \"grand parasol\""
        , parents: {mere: "Aladin Maurine", pere: "Aladin Pierre", phone: "0555112233"}
        , photo: "aladin-fabrice.png"
        , scolarity_fees: {"2023": {internat:true,scolarite:true,uniforme:false,manuels:false}}
        , bolobi_class_history: {"2022": "CE1-A", "2021": "CP2-C", "2020": "CP2-B"}
        , school_history: {"2022": "bolobi","2021": "bolobi", "2020": "yakasseme"}
        , absences: ["2023-09-20","2023-09-22"]
        , notes: {"2023": {"francais": [
                {"23-09": "12", "12-10": "15", "03-12": "08"}
                , {"17-01": "12", "02-02": "15", "03-03": "18"}
                , {"23-04": "12", "12-05": "15", "03-06": "03"}
            ]}
        }
        , compositions: {"2023": ["12","08","09","14.5"], "2022": ["12","08","09","14.5"], "2021": ["12","08","09","14.5"], }
        , moyenne_trimetriel: {"2023": ["10.23", "13.05", "09.46"], "2022": ["10.23", "13.05", "09.46"], "2021": ["10.23", "13.05", "09.46"]}
        , bonus: [{"2023-09-21": "S'est démarqué par sa bravour et son esprit d'équipe durant le festivale d'aujourd'hui"}]
        , manus: [{"2023-09-12": "N'a pas fait ses devoir"}]
        , isInterne: false
        , commentaires: {"2023-10-12": "il n'arrete pas de crier et est un grand pertubateur, faire attention à bien le cadrer pour éviter que son comportement ne se répande parmis les autres élèves."}
        , documents: ["certificat de naissance",]
    }
    , {
        id: "2"
        , current_classe: "CP1-A"
        , nom: "Aladin"
        , prenoms: ["Fabrice", "Jeanne"]
        , naissance: "01-01-2015"
        , adresse: "yakasseme, proche boutique MTN \"grand parasol\""
        , parents: {mere: "Aladin Maurine", pere: "Aladin Pierre", phone: "0555112233"}
        , photo: "aladin-fabrice.png"
        , scolarity_fees: {"2023": {internat:true,scolarite:true,uniforme:false,manuels:false}}
        , bolobi_class_history: {"2022": "CE1-A", "2021": "CP2-C", "2020": "CP2-B"}
        , school_history: {"2022": "bolobi","2021": "bolobi", "2020": "yakasseme"}
        , absences: ["2023-09-20","2023-09-22"]
        , notes: {"2023": {"francais": [
                {"23-09": "12", "12-10": "15", "03-12": "08"}
                , {"17-01": "12", "02-02": "15", "03-03": "18"}
                , {"23-04": "12", "12-05": "15", "03-06": "03"}
            ]}
        }
        , compositions: {"2023": ["12","08","09","14.5"], "2022": ["12","08","09","14.5"], "2021": ["12","08","09","14.5"], }
        , moyenne_trimetriel: {"2023": ["10.23", "13.05", "09.46"], "2022": ["10.23", "13.05", "09.46"], "2021": ["10.23", "13.05", "09.46"]}
        , bonus: [{"2023-09-21": "S'est démarqué par sa bravour et son esprit d'équipe durant le festivale d'aujourd'hui"}]
        , manus: [{"2023-09-12": "N'a pas fait ses devoir"}]
        , isInterne: true
        , commentaires: {"2023-10-12": "il n'arrete pas de crier et est un grand pertubateur, faire attention à bien le cadrer pour éviter que son comportement ne se répande parmis les autres élèves."}
        , documents: ["certificat de naissance",]
    }
]


export const ecole_profs = [
    {
        id:"1"
        , current_classes: "1"
        , nom: "Ambeu"
        , prenoms: ["JC"]
        , naissance: "01-01-1980"
        , adresse: "yakasseme, proche garage"
        , photo: "ambeu-jc.png"
        , phone: "0701010101"
        , email: "prof@bolobi.ci"
    }
]