"use client"

import { useState, useEffect } from 'react';
// import MapLeaflet from '../../_/MapLeaflet_Gemini';
import Gmap from '../../_/Gmap_plus.jsx'

const fields_placeholder = {
    nom: "ex: Smith"
    , prenoms: "ex: John, Junior"
    , naissance: "JJ-MM-YYYY"
    , mere: "ex: Smith, Johana, Jane"
    , pere: "ex: Smith, John, Senior"
}
    , fields_defaultValue = {
        "nom": "Nom de famille",
        "prenoms": "Prénoms",
        "naissance": "Date de Naissance",
        "mere": "Mère",
        "pere": "Père",
        "phone": "Numéro de Téléphone des parents",
        "adresse": "Adresse géographique",
        "photo": "Photo d'identité",
        "scolarity_fees": "Frais de scolarité",
        "school_history": "Historique scolaire",
        "notes": "Liste des NOTES pour chaque année",
        "compositions": "Liste des COMPOSITIONS pour chaque année",
        "bonus": "Liste des ENCOURAGEMENTS",
        "manus": "Liste des PUNITIONS",
        "isInternes": "Est un élève interne ?",
        "moyenne_trimetriel": "Moyennes trimestielles pour chaque année",
        "metas": "Informations complémentaires",
        "path": "Dossier source de l'image",


    }
    , default_input_placeholder = "___default_text___"
    , doRequiredInput = false


const StudentForm = ({ model, modelKey, joinedDatasProps, endpoint, hiddens = {}, datas, hides = [] }) => {
    // console.log(model);
    // console.log(datas);

    let currentSchoolYear = new Date()
    currentSchoolYear = (currentSchoolYear.getMonth() + 1) < 7 ? (currentSchoolYear.getFullYear() - 1) + "-" + currentSchoolYear.getFullYear() : currentSchoolYear.getFullYear() + "-" + (currentSchoolYear.getFullYear() + 1)
    let currentSchoolYearField = JSON.stringify({ [currentSchoolYear]: false })

    const [formData, setFormData] = useState({ timestamp: +new Date(), "scolarity_fees_$_checkbox": currentSchoolYearField, "isInternes_$_checkbox": false })
        , [selectedImage, setSelectedImage] = useState("")
        , [selectedFile, setSelectedFile] = useState({})
        , [latitude, setLatitude] = useState('') // State for latitude
        , [longitude, setLongitude] = useState('') // State for longitude
        , [showMap, setShowMap] = useState(false) // State for longitude

    useEffect(() => {
        if (modelKey === "slider" && !datas) {
            setFormData(prev => ({
                ...prev,
                "metas": JSON.stringify({ path: "" })
            }));
        }
    }, [modelKey, datas]);

    let handleClickCheckbox = ({ target }) => {
        const { checked, name } = target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: checked,
        }))
    }
        , handleChange = (e) => {
            const { name, value, files, type, checked } = e.target;
            console.log(name + " " + value + " " + files + " " + type, " " + checked);

            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: files?.[0] || (type == "checkbox") ? checked : value,
            }))
        }
        , handleObjectChange = (e, inputName) => {
            const { value, checked } = e.target
                , subName = e.target.dataset.name
                , absoluteValue = (e.target.type === "checkbox") ? checked : value
            console.log(e.target);
            console.log(e.target.checked);
            console.log(checked);



            setFormData((prevFormData) => {
                // let subName = name.split('_*_')[1]
                return {
                    ...prevFormData,
                    [inputName]: JSON.stringify(
                        prevFormData?.[inputName]
                            ? { ...JSON.parse(prevFormData?.[inputName]), [subName]: absoluteValue }
                            : { [subName]: absoluteValue }
                    )
                }
            })
            console.log(formData);

        }
        , handleSubmit = (e) => {
            e.preventDefault();
            
            // On s'assure d'avoir un timestamp frais et unique pour cette soumission
            const currentTimestamp = +new Date();
            setFormData(prev => ({ ...prev, timestamp: currentTimestamp }));

            // Envoyer les données du formulaire au backend ou effectuer une autre action
            console.log('Données soumises :', formData);
            console.log(e.target);
            let multi = false
            const obj = {}
                // On recrée le FormData pour être sûr qu'il a les dernières valeurs si besoin
                // Mais pour le timestamp, on va le gérer manuellement dans obj
                , ___formData = new FormData(e.target)
                , ___formData_Arr = Array.from(___formData)
            
            let baseName = "";
            let metasPath = "";

            ___formData_Arr.forEach(r => {
                // console.log(r[1] instanceof File);
                if (r[0] == "parents") {
                    console.log("here");
                    console.log(r[1]);
                }
                if (typeof r[1] == "object" && !(r[1] instanceof File)) {
                    console.log("\n--\n");
                    console.log(r[0]);
                    console.log(r[1]);
                }

                const isFileField = r[0].indexOf("_$_file") !== -1;
                const file = r[1];

                if (isFileField && file && file.name) {
                    multi = true;
                    // On utilise le timestamp qu'on vient de générer
                    const timestamp = currentTimestamp;
                    const extension = file.name.substring(file.name.lastIndexOf("."));
                    baseName = file.name.substring(0, file.name.lastIndexOf("."));
                    
                    // On récupère le chemin 'path' depuis metas pour construire le chemin final
                    try {
                        const metasObj = typeof obj.metas === 'string' ? JSON.parse(obj.metas) : obj.metas;
                        metasPath = metasObj?.path ? metasObj.path + "/" : "";
                    } catch(e) {}

                    const newFilename = `${baseName}_${timestamp}${extension}`;

                    // On stocke le chemin relatif correct commençant par /images/ pour la DB
                    obj[r[0]] = `/images/${metasPath}${newFilename}`;
                } else {
                    let val = (typeof r[1] === "object" && !(r[1] instanceof File)) ? JSON.stringify(r[1]) : r[1];
                    // Si on est sur le champ metas, on s'assure d'envoyer un objet pour Mongoose
                    if (r[0] === "metas" && typeof val === "string") {
                        try {
                            val = JSON.parse(val);
                        } catch(e) {}
                    }
                    obj[r[0]] = val;
                }
            });

            const settings = {
                method: datas ? "PATCH" : "POST"
                , headers: {
                    'Content-Type': 'application/json',
                }
                , body: JSON.stringify(obj)
            }

            ___formData.append('ok', "khiuhu")
            
            fetch(`/api/${endpoint ? endpoint : modelKey}` + (datas ? `?_id=${datas?._id}` : ""), settings)
                .then(r => r.json())
                .then(data => {
                    console.log(data);
                    if (multi) {
                        const createdFilename = modelKey === "classe"
                            ? (obj.annee + "___" + obj.niveau + "-" + obj.alias)
                            : (obj.nom && obj.prenoms ? obj.nom + "_" + obj.prenoms : baseName);

                        console.log("Preparing Media Upload with filename:", createdFilename);
                        alert("Filename: " + createdFilename);

                        const settingsMedia = {
                            method: "POST",
                            body: ___formData
                        };
                        
                        ___formData.set('timestamp', currentTimestamp);
                        
                        const metasPathQuery = metasPath ? `&pathRel=${metasPath.replace("/","")}` : "";
                        const mediaUrl = `/api/media?type=${modelKey}s&createdFilename=${createdFilename}${metasPathQuery}` + (datas ? `&src=${datas?.src_$_file}` : "");
                        
                        console.log("Calling Media API:", mediaUrl);
                        
                        fetch(mediaUrl, settingsMedia)
                            .then(r => r.json())
                            .then(dataMedia => {
                                console.log("Media API Response:", dataMedia);
                                alert("Image et données sauvegardées avec succès !");
                            })
                            .catch(err => {
                                console.error("Media API Error:", err);
                                alert("Erreur lors de la sauvegarde de l'image.");
                            });
                    }
                })


            // Réinitialiser les champs du formulaire
            setFormData({});
        }
        , handleMapClick = (coords) => { // Expects { lat, lng }
            const lat = coords.lat.toFixed(6);
            const lng = coords.lng.toFixed(6);
            setLatitude(lat); // Update state with fixed precision
            setLongitude(lng);

            // Find the map field key in the model (e.g., 'adresse_$_map')
            const mapFieldKey = Object.keys(model).find(k => k.endsWith('_$_map'));
            // console.log(mapFieldKey);
            console.log(formData[mapFieldKey]);


            if (mapFieldKey) {
                setFormData(prevFormData => {
                    const existingVal = prevFormData[mapFieldKey] || "";
                    return {
                        ...prevFormData,
                        [mapFieldKey]: existingVal + ";;;" + JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) })
                    };
                });
            }
        }

    const getTimestamp = () => {
        return Date.now();
    };
    // console.log(hiddens);


    useEffect(() => {
        // Assuming address coordinates are stored like 'adresse_latitude', 'adresse_longitude'
        // Adjust field names if they are different
        const latField = 'adresse_latitude';
        const lonField = 'adresse_longitude';
        if (datas && typeof datas === 'object') {
            setLatitude(datas[latField] || '');
            setLongitude(datas[lonField] || '');
            
            if (datas.metas) {
                try {
                    const parsed = typeof datas.metas === 'string' ? JSON.parse(datas.metas) : datas.metas;
                    setFormData(prev => ({ ...prev, metas: JSON.stringify(parsed) }));
                } catch (e) {
                    console.error("Error parsing metas", e);
                }
            }
        } else {
            setLatitude('');
            setLongitude('');
        }
    }, [datas]) // Re-run if datas changes

    return (
        <form id="EditMongoForm" className={`c-modal__form ${((modelKey == "teacher" || modelKey == "student") ? "member " : "")}${modelKey}${datas ? "_update" : ""}`} onSubmit={handleSubmit}>
            <input type="hidden" name="modelKey" defaultValue={modelKey} />
            <input type="hidden" name="timestamp" value={formData.timestamp} />
            {/* { console.log(model) } */}
            {/* {datas && <input type="hidden" value={datas._id} name="_id" />} */}
            {Object.keys(model).map((key) => {
                if (model.hasOwnProperty(key) && key != "_id" && key != "__v") {

                    const { instance: fieldType } = model[key];
                    const typeMapping = {
                        'String': String,
                        'Number': Number,
                        'Boolean': Boolean,
                        'Array': Array,
                        'Mixed': Object,
                        'ObjectId': Object,
                        'Date': Date
                    };
                    const _eval = typeMapping[fieldType] || String;
                    let defaultValue = model[key].options?.default || ""
                    // let defaultValue= model[key].options?.default || default_input_placeholder;
                    // const defaultValue= model[key].options?.default || _eval !== Object ? key+"__i" : "rien";
                    const inputName = `${key}`
                    // const inputName = `student_${key}`;
                    let property_baseValue = key.split('_$_')[0]
                        , inputType = key.split('_$_')[1] ? key.split('_$_')[1] : "text"
                        , hidden = false
                        , endLabel = ""
                    // console.log(inputType);
                    // alert(key+' property_baseValue '+property_baseValue)
                    let other_input_type = false
                        , checked = ""
                        , add_btn = ""

                    // console.log(key);
                    // console.log(fieldType);
                    // console.log(defaultValue);
                    // console.log(_eval);
                    // console.log(model[key]);
                    // console.log(model[key].options?.default);

                    console.log(hides);
                    // if(hides?.includes(inputName))return;

                    switch (inputType) {
                        case "tel":
                            break;
                        case "email":
                            break;
                        case "date":
                            break;
                        case "checkbox":
                            break;
                        case "radio":
                            break;
                        case "map":
                            endLabel = <>
                                {!showMap && <button type="button" onClick={
                                    ({ target }) => {
                                        setShowMap(true)
                                    }
                                }>Choisir sur la carte</button>}
                                {showMap && <div key={key}>
                                    {showMap && <button type="button" onClick={e => { setShowMap(false) }}>Fermer la carte</button>}
                                    <p>{property_baseValue}:</p>
                                    <input
                                        type="hidden"
                                        name={inputName + "_"}
                                        value={""} // Store as JSON string
                                    // defaultValue="{}"
                                    />
                                    <div className="mongo-form__coordinates-group">
                                        <p>Coordonnées Géographiques: </p>
                                        <div className="mongo-form__field-row">
                                            <label htmlFor={"latFieldName"}>Latitude</label>
                                            <input
                                                id={"latFieldName"}
                                                name={"latFieldName"} // Important for form submission
                                                type="number"
                                                step="any"
                                                className="form-control"
                                                placeholder="Latitude"
                                                value={latitude} // Controlled component
                                                // onChange={(e) => setLatitude(e.target.value)} // Update state on change
                                                readonly
                                            />
                                            <label htmlFor={"lonFieldName"}>Longitude</label>
                                            <input
                                                id={"lonFieldName"}
                                                name={"lonFieldName"} // Important for form submission
                                                type="number"
                                                step="any"
                                                className="form-control"
                                                placeholder="Longitude"
                                                value={longitude} // Controlled component
                                                // onChange={(e) => setLongitude(e.target.value)} // Update state on change
                                                readonly
                                            />
                                        </div>
                                        {/* Render the Map Component */}
                                        <Gmap
                                            // Pass initial center based on current state (which might be from datas)
                                            // initialCenter={{ lat: parseFloat(latitude) || 5.36, lng: parseFloat(longitude) || -4.00 }}
                                            onCoordinatesClick={handleMapClick} // Pass the callback function
                                        />
                                        <small>Cliquez sur la carte pour définir/modifier les coordonnées.</small>
                                    </div>
                                </div>}
                            </>;
                            break;
                        case "file":
                            handleChange = ({ target }) => {
                                if (target.files) {
                                    const file = target.files[0]
                                    setSelectedImage(URL.createObjectURL(file))
                                    setSelectedFile(file)
                                }
                            }
                            hidden = true
                            endLabel = <div>
                                {selectedImage ? (
                                    <label htmlFor={inputName} className="mongo-form__label-clickable">
                                        <img src={selectedImage} alt="" />
                                    </label>
                                ) : datas ? (
                                    <label htmlFor={inputName} className="c-modal__form__file-label">Select Image (if not, same image will be saved)</label>
                                ) : (
                                    <label htmlFor={inputName} className="c-modal__form__file-label">Select Image</label>
                                )
                                }
                            </div>
                            break;
                        case "hidden":
                            defaultValue = hiddens[inputName.split("_$_hidden")[0]] || defaultValue
                            break;
                        case "password":
                            break;
                        case "url":
                            break;
                        case "time":
                            break;
                        case "week":
                            break;
                        case "month":
                            break;
                        case "range":
                            break;
                        default:
                            if (inputType.split('_µ_')[0] == "ref") {

                                const joinedDataName = key.split('_$_')[1].split('_µ_')[1]
                                    , joinedData = joinedDatasProps[joinedDataName]
                                    , handleSingleChoice = (e) => {

                                    }
                                    , handleMultipleChoice = (e) => {
                                        if (e.target.value != "") {
                                            document.getElementById(inputName).values = document.getElementById(inputName).values
                                                ? document.getElementById(inputName).values.add(e.target.value)
                                                : new Set([e.target.value])
                                            document.getElementById(inputName).value = Array.from(document.getElementById(inputName).values).join(',')
                                            document.getElementById(inputName + "_div").innerHTML = ""
                                            Array.from(document.getElementById(inputName).values).forEach(elt => {
                                                let span = document.createElement('span')
                                                span.innerHTML = e.target.querySelectorAll('option')[e.target.selectedIndex].innerHTML
                                                span.addEventListener('click', ee => {
                                                    ee.stopPropagation()
                                                    ee.target.remove(ee.target)
                                                    e.selectedIndex = 0
                                                    document.getElementById(inputName).values.delete(elt)
                                                })
                                                document.getElementById(inputName + "_div").append(span)
                                            })
                                        }
                                    }
                                // console.log(joinedDatasProps);
                                // console.log(joinedDataName);
                                // console.log(joinedData);

                                switch (property_baseValue) {
                                    case "school_history":
                                        add_btn = <>
                                            Année scolaire:
                                            <input
                                                type="text"
                                                id={property_baseValue + "_date"}
                                            /> ?
                                            <button onClick={e => {
                                                let a = document.getElementById(property_baseValue + "_date").value
                                                if (a == parseInt(a) && a > 1990 && a < new Date().getFullYear()) {
                                                    defaultValue[a + '-' + (a + 1)] = ""
                                                } else alert('Entrer une date valide/plausible svp')
                                            }}>+</button>
                                        </>
                                        break
                                    case "current_classe":
                                    case "professeur":
                                        console.log("uhiuhiuh");
                                        console.log(joinedDatasProps);
                                        console.log(joinedDataName);
                                        console.log(joinedData);
                                        other_input_type = <>
                                            <select
                                                name={inputName}
                                                required={doRequiredInput && true}
                                                defaultValue=""
                                            >
                                                <option value="">Choisir {joinedDataName}</option>
                                                {joinedData?.map((elt, i) => <option key={property_baseValue + "_" + i} value={elt._id}>{(elt.niveau && elt.alias) ? elt.niveau + "-" + elt.alias : elt.nom + "-" + elt?.prenoms}</option>)}
                                            </select>
                                        </>
                                        break;
                                    case "bolobi_class_history":
                                    case "current_classes":
                                    case "eleves":
                                        other_input_type = <>
                                            <select
                                                onChange={handleMultipleChoice}
                                                required={doRequiredInput && true}
                                                defaultValue=""
                                            >
                                                <option value="">Choisir {joinedDataName}</option>
                                                {joinedData?.map((elt, i) => <option key={property_baseValue + "_" + i} value={elt._id}>{(elt.niveau && elt.alias) ? elt.niveau + "-" + elt.alias : elt.nom + "-" + elt?.prenoms}</option>)}
                                            </select>
                                            <div id={inputName + "_div"}></div>
                                            <input
                                                type="hidden"
                                                name={inputName}
                                                id={inputName}
                                                required={doRequiredInput && true}
                                            />
                                        </>
                                        break;

                                    default:
                                        other_input_type = <>
                                            <select name={inputName}
                                                required={doRequiredInput && true}
                                            >
                                                <option selected>Choisir {joinedDataName}</option>
                                                {joinedData.map((elt, i) => <option key={property_baseValue + "_" + i} value={elt.id}>{elt.niveau}-{elt.alias}</option>)}
                                            </select>
                                        </>
                                        break;
                                }
                            }
                            break;
                    }
                    // if(defaultValue+"" == "[object Object]")defaultValue = default_input_placeholder

                    if (_eval === String || _eval === Boolean || _eval === Number) {
                        // alert(inputName+" "+inputType)
                        return (<div>
                            <label key={key} className={key.split('_$_')[0]}>
                                {fields_defaultValue[key.split('_$_')[0]] || key.split('_$_')[0]} {/*(simple value)*/}:
                                <input
                                    type={inputType}
                                    name={inputName}
                                    defaultValue={
                                        inputType === "file"
                                            ? undefined
                                            : inputType === "hidden"
                                                ? defaultValue
                                                : datas
                                                    ? datas[inputName]
                                                    : inputType === "checkbox"
                                                        ? undefined
                                                        : defaultValue
                                    }
                                    id={inputType === "file" ? inputName : undefined}
                                    placeholder={fields_placeholder[key] || defaultValue}
                                    onChange={handleChange}
                                    onClick={inputType == "checkbox" ? handleClickCheckbox : undefined}
                                    // defaultChecked={inputType=="checkbox" ? model[key].defaultValue : undefined}
                                    required={doRequiredInput && true}
                                    hidden={hidden}
                                />
                            </label>
                            {endLabel}
                        </div>
                        );
                    }

                    if (_eval === Array) {
                        return (<div>
                            <label key={key} className={key.split('_$_')[0]}>
                                {fields_defaultValue[key.split('_$_')[0]] || key.split('_$_')[0]} (array):
                                <input
                                    type={inputType}
                                    name={inputName}
                                    value={formData[inputName] || (Array.isArray(defaultValue) ? defaultValue.join(',') : defaultValue)}
                                    placeholder={fields_placeholder[key] || defaultValue}
                                    onChange={(e) => {
                                        const values = e.target.value.split(',');
                                        setFormData((prevFormData) => ({
                                            ...prevFormData,
                                            [inputName]: values,
                                        }));
                                    }}
                                    required={doRequiredInput && true}
                                />

                            </label>
                        </div>);
                    }

                    if (_eval === Object)
                        if (!other_input_type) {
                            return (
                                <div key={key} className={key.split('_$_')[0]}>
                                    <p>{fields_defaultValue[property_baseValue] || property_baseValue} :</p>
                                    <input
                                        type="hidden"
                                        name={inputName}
                                        value={formData[inputName]}
                                        defaultValue={"{}"}
                                    />
                                    {(() => {
                                        let currentMetas = {};
                                        try {
                                            currentMetas = formData[inputName] 
                                                ? JSON.parse(formData[inputName]) 
                                                : (datas?.[inputName] 
                                                    ? (typeof datas[inputName] === 'string' ? JSON.parse(datas[inputName]) : datas[inputName])
                                                    : defaultValue);
                                            
                                            // Si on est dans metas et que path n'existe pas, on l'initialise
                                            if (property_baseValue === "metas" && !currentMetas?.path) {
                                                currentMetas = { ...currentMetas, path: "" };
                                            }
                                        } catch (e) {
                                            currentMetas = typeof defaultValue === 'object' ? defaultValue : {};
                                        }

                                        return Object.keys(currentMetas || {}).map((subKey) => {
                                            let checked = inputType == "checkbox" ? currentMetas[subKey] : "";
                                            let subValue = currentMetas[subKey];
                                            
                                            return (
                                                <label key={subKey}>
                                                    {fields_defaultValue[subKey] || subKey}:
                                                    <input
                                                        type={inputType}
                                                        data-name={subKey}
                                                        defaultValue={subValue}
                                                        placeholder={fields_placeholder[subKey] || ""}
                                                        onChange={(e) => { handleObjectChange(e, inputName) }}
                                                        defaultChecked={checked}
                                                        required={doRequiredInput && true}
                                                    />
                                                </label>
                                            );
                                        });
                                    })()}
                                </div>
                            );
                        } else return (
                            <div key={key}>
                                {/* <p>{key.split('_$_')[0]}:</p> */}
                                {other_input_type}
                            </div>
                        )

                    // Autres types de données non pris en charge
                    return null;
                }
            })}

            <button type="submit">{datas ? "Modifier" : "Créer"}</button>
            <hr />
            <div className="formDataDisplay">
                {JSON.stringify(formData)}
            </div>
        </form>
    );
};

export default StudentForm;
