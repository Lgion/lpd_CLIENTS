import {useState, useEffect} from "react"
import MealPlanOptions from "./MealPlanOptions"

// Données JSON pour les options de repas
const mealOptions = {
    breakfast: ["Bakka (bouilli: riz ou maïs)", "café-pain"],
    lunch: ["APF", "Tchep", "Kedjenou"],
    dinner: ["APF", "Tchep", "Kedjenou"]
};

export default function FieldsetMeal({SectionCheckboxStyled, toggleFormNdrImg, onMealPlanChange, onCustomMealChange, handleFieldsetValidation}) {
    const [isMealIncluded, setIsMealIncluded] = useState(false);
    const [mealPlan, setMealPlan] = useState(""); 
    const [customMeal, setCustomMeal] = useState({
        breakfast: "",
        lunch: "",
        dinner: ""
    });
    const [showCustomInput, setShowCustomInput] = useState({
        breakfast: false,
        lunch: false,
        dinner: false
    });

    // Notifier le parent des changements de repas
    useEffect(() => {
        onCustomMealChange(customMeal);
    }, [customMeal, onCustomMealChange]);

    useEffect(() => {
        const div = document.querySelector('article.meal>div')
        let tmp = ""
        if(customMeal["breakfast"])tmp += "<span>Petit-déjeuner: <b>"+customMeal["breakfast"]+"</b></span>"
        if(customMeal["lunch"])tmp += "<span>Déjeuner: <b>"+customMeal["lunch"]+"</b></span>"
        if(customMeal["dinner"])tmp += "<span>Diner: <b>"+customMeal["dinner"]+"</b></span>" 
        div.innerHTML = tmp
    }, [customMeal]);

    const handleMealChange = (e) => {
        setIsMealIncluded(e.target.checked);
        if (!e.target.checked) {
            setMealPlan("");
        }
    };

    const handleMealPlanChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setMealPlan(value);
        if(value) document.querySelector("article.meal>b").innerHTML = value + " repas /jour/personne";
        onMealPlanChange(value); // Notifier le composant parent
    };

    const handleCustomMealChange = (mealType, e) => {
        setCustomMeal(prev => ({...prev, [mealType]: e.target.value}))
    }

    const handleRadioChange = (mealType, value) => {
        setShowCustomInput(prev => ({...prev, [mealType]: value === 'custom'}));
        setCustomMeal(prev => ({
            ...prev, 
            [mealType]: value === 'custom' ? prev[mealType] : value
        }));
    };

    // Fonction pour générer une colonne de repas
    const generateMealColumn = (mealType, options) => {
        
        // alert(JSON.stringify(customMeal))

        
        return <div className="mealColumn card">
            <div className="card-header">
                <h5 className="mb-0">{mealType === "breakfast" ? "Petit-déjeuner" : mealType === "lunch" ? "Déjeuner" : "Diner"}</h5>
            </div>
            <div className="card-body">
                {options.map((option) => (
                    <div className="form-check" key={`${mealType}-${option}`}>
                        <input 
                            className="form-check-input" 
                            type={mealType === "breakfast" ? "radio" : "checkbox"}
                            name={mealType} 
                            id={`${mealType}-${option}`} 
                            value={option.toLowerCase()} 
                            onChange={(e) => {
                                if (mealType === "breakfast") {
                                    handleRadioChange(mealType, option.toLowerCase());
                                } else {
                                    // Pour checkbox, on gère un tableau de valeurs
                                    const currentValues = customMeal[mealType] ? customMeal[mealType].split(';') : [];
                                    if (e.target.checked) {
                                        currentValues.push(option.toLowerCase());
                                    } else {
                                        const index = currentValues.indexOf(option.toLowerCase());
                                        if (index > -1) currentValues.splice(index, 1);
                                    }
                                    setCustomMeal(prev => ({
                                        ...prev,
                                        [mealType]: currentValues.join(';')
                                    }));
                                }
                            }}
                            checked={mealType === "breakfast" 
                                ? customMeal[mealType] === option.toLowerCase()
                                : customMeal[mealType]?.split(';').includes(option.toLowerCase())
                            }
                        />
                        <label className="form-check-label" htmlFor={`${mealType}-${option}`}>
                            {option}
                        </label>
                    </div>
                ))}
                {mealType !== "breakfast" && <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="checkbox"
                        name={`${mealType}-custom`} 
                        id={`${mealType}-custom`} 
                        onChange={(e) => {
                            setShowCustomInput(prev => ({...prev, [mealType]: e.target.checked}));
                            if (!e.target.checked) {
                                setCustomMeal(prev => {
                                    const values = prev[mealType].split(';').filter(v => mealOptions[mealType].map(o => o.toLowerCase()).includes(v));
                                    return {...prev, [mealType]: values.join(';')};
                                });
                            }
                        }}
                        checked={showCustomInput[mealType]}
                    />
                    <label className="form-check-label" htmlFor={`${mealType}-custom`}>
                        Personnalisé <sup>(séparer par des ";" si vous avez plusieurs propositions)</sup>
                    </label>
                </div>}
                {showCustomInput[mealType] && (
                    <input 
                        type="text" 
                        className="form-control mt-2" 
                        value={customMeal[mealType]} 
                        placeholder="séparer par des ';' si vous avez plusieurs propositions"
                        onChange={(e) => handleCustomMealChange(mealType, e)} 
                    />
                )}
            </div>
            <div></div>
        </div>
        
}

    // Générer les colonnes de repas
    const breakfastColumn = generateMealColumn("breakfast", mealOptions.breakfast);
    const lunchColumn = generateMealColumn("lunch", mealOptions.lunch);
    const dinnerColumn = generateMealColumn("dinner", mealOptions.dinner);

    return <>
        {/* {JSON.stringify(customMeal)} */}
        <style jsx>{`
            .meal {
                margin-bottom: 2rem;
            }

            
            .mealOptions {
                width:100%;
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                margin-top: 1rem;
            }

            .mealOptions :global(.mealColumn) {
                flex: 1;
                min-width: 250px;
                box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
                transition: all 0.3s ease-in-out;
                flex-basis:30%;
            }

            .mealColumn:hover {
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
                transform: translateY(-0.25rem);
            }

            .card-header {
                background-color: #f8f9fa;
                border-bottom: 1px solid rgba(0, 0, 0, 0.125);
            }

            .card-header h5 {
                color: #495057;
                font-weight: 600;
            }

            .card-body {
                padding: 1.25rem;
            }

            .form-check {
                margin-bottom: 0.5rem;
            }

            .form-check-input {
                margin-top: 0.3rem;
            }

            .form-check-label {
                margin-left: 0.25rem;
                color: #495057;
            }

            .form-control {
                display: block;
                width: 100%;
                padding: 0.375rem 0.75rem;
                font-size: 1rem;
                line-height: 1.5;
                color: #495057;
                background-color: #fff;
                background-clip: padding-box;
                border: 1px solid #ced4da;
                border-radius: 0.25rem;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }

            .form-control:focus {
                color: #495057;
                background-color: #fff;
                border-color: #80bdff;
                outline: 0;
                box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            }

            .mealPlanOptions {
                margin-top: 1rem;
                margin-bottom: 1rem;
                padding: 1rem;
                background-color: #f8f9fa;
                border-radius: 0.25rem;
                width: 50%;
                align-self: center;
                border: 1px solid;
                box-shadow: 0 0 10px 1px;
                padding: 1em 3em;
            }

            .mealPlanOptions h5 {
                margin: 1.5rem .5rem;
                color: #495057;
            }

            .mealPlanOptions .form-check {
                margin-bottom: 0.5rem;
            }

            @media (max-width: 768px) {
                .mealOptions {
                    flex-direction: column;
                }

                .mealColumn {
                    width: 100%;
                }
            }
        `}</style> 
        <fieldset className="meal">
            <h4 onClick={toggleFormNdrImg}>Choisir si vous souhaitez que les repas vous soient préparés: </h4>
            <h5>Vous pouvez <u><b>soit préparer vous-même</b> vos repas</u> au refectoire du santuaire, <u><b>soit commander</b> votre repas</u> à la cuisine du sanctuaire.</h5>
            <h5>Si vous préparez vous-même, tous les outils de cuisine et de dégustation sont à votre disposition (marmite, casserols, couteaux, etc...)</h5>
            <h5>il faut juste prévoir <u><b>VOTRE</b> propre bouteille de gaz</u></h5>
            <p>CHOISIR <u><b>AVEC</b> OU <b>SANS</b></u> REPAS: (<i><u>sans repas</u> par défaut</i>)</p>
            <SectionCheckboxStyled>
                <label htmlFor="meal">
                    <input type="checkbox" id="meal" name="meal_included" onChange={handleMealChange} />
                    <span><span>Avec Repas</span> <span>🍔 😋 🍲</span></span>
                    <i className="indicator">
                        <svg version="1.1" id="toggle" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 55 55" xmlSpace="preserve"
                        >
                            <path className="circ path" style={{ fill: "none", strokeWidth: 3, strokeLinejoin: "round", strokeMiterlimit: 10 }} d="M6.2,6.2L6.2,6.2
                    c-5.7,5.7-5.7,14.8,0,20.5l0,0c5.7,5.7,14.8,5.7,20.5,0l0,0c5.7-5.7,5.7-14.8,0-20.5l0,0C21.1,0.6,11.9,0.6,6.2,6.2z"
                            />
                            <polyline className="cross path" style={{ fill: "none", stroke: "#CD4C10", strokeWidth: 3, strokeLinejoin: "round", strokeMiterlimit: 10 }} points=" 11.4,11.4 21.6,21.6 " />
                            <polyline className="cross path" style={{ fill: "none", stroke: "#CD4C10", strokeWidth: 3, strokeLinejoin: "round", strokeMiterlimit: 10 }} points="21.6,11.4 11.4,21.6  " />
                            <polyline className="tick path" style={{ fill: "none", stroke: "#557D25", strokeWidth: 3, strokeLinejoin: "round", strokeMiterlimit: 10 }} points="10,17.3 13.8,21.1 
                    23,11.9 "
                            />
                        </svg>
                    </i>
                    <span>Sans Repas 🚫</span>
                </label>
            </SectionCheckboxStyled>
            <p>
                {isMealIncluded && <>Vous avez choisi <span>AVEC <span className={!mealPlan&&"alert"}>{mealPlan || "0"}</span> repas</span></>}
                {!isMealIncluded && <>Vous avez choisi <span>SANS repas</span></>}
            </p>
            {isMealIncluded && (
                <MealPlanOptions mealPlan={mealPlan} handleMealPlanChange={handleMealPlanChange} />
            )}

            
            {/* POUR INCLURE LES REPAS (QUE MAMAN N'A PAS VOULU INCLURE)*/}
            {/* {isMealIncluded && mealPlan && (
                <div className="mealOptions">
                    {breakfastColumn}
                    {mealPlan >= 2 && lunchColumn}
                    {dinnerColumn}
                </div>
            )} */}



            <button 
              className="validate-button"
              onClick={(e) => {
                e.preventDefault();
                console.log();
                
                if(!document.querySelector('input[name="meal_included"]').checked){
                    const mealConfirm = confirm('Voulez-vous vraiment NE PAS commander un repas pour votre séjour ?')
                    if(mealConfirm)handleFieldsetValidation('meal');
                }else if(oneMeal.checked||twoMeals.checked)handleFieldsetValidation('meal');
                else alert("Vous avez choisi \"AVEC Repas\"\nVeuillez alors sélectionner votre formule: \n1repas ou 2repas ?")
              }}
            >
              Valider
            </button>
        </fieldset>
    </>
}
