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


}
, default_input_placeholder = "___default_text___"
, doRequiredInput = false


const StudentForm = ({ model, modelKey, joinedDatasProps, endpoint, hiddens={}, datas, hides= [] }) => {
    // console.log(model);
    // console.log(datas);

    let currentSchoolYear = new Date()
    currentSchoolYear = (currentSchoolYear.getMonth()+1)<7 ? (currentSchoolYear.getFullYear()-1)+"-"+currentSchoolYear.getFullYear() : currentSchoolYear.getFullYear()+"-"+(currentSchoolYear.getFullYear()+1)
    let currentSchoolYearField = JSON.stringify({[currentSchoolYear]: false})

    const [formData, setFormData] = useState({timestamp: +new Date(), "scolarity_fees_$_checkbox": currentSchoolYearField, "isInternes_$_checkbox": false})
    , [selectedImage, setSelectedImage] = useState("")
    , [selectedFile, setSelectedFile] = useState({})
    , [latitude, setLatitude] = useState('') // State for latitude
    , [longitude, setLongitude] = useState('') // State for longitude
    , [showMap, setShowMap] = useState(false) // State for longitude

    let handleClickCheckbox = ({target}) => {
        const {checked,name} = target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: checked,
        }))
    }
    , handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        console.log(name+" "+value+" "+files+" "+type," "+checked); 
        
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: files?.[0] || (type=="checkbox") ? checked : value,
        }))
    }
    , handleObjectChange = (e, inputName) => {
        const { value,checked } = e.target
        , subName = e.target.dataset.name
        , absoluteValue = (e.target.type==="checkbox")?checked:value
        console.log(e.target);
        console.log(e.target.checked);
        console.log(checked);

        
        
        setFormData((prevFormData) => {
            // let subName = name.split('_*_')[1]
            return {
                ...prevFormData,
                [inputName]: JSON.stringify(
                    prevFormData?.[inputName] 
                        ? {...JSON.parse(prevFormData?.[inputName]), [subName]: absoluteValue }
                        : {[subName]: absoluteValue}
                )
            }
        })
        console.log(formData);
        
    }
    , handleSubmit = (e) => {
        e.preventDefault();
        // Envoyer les données du formulaire au backend ou effectuer une autre action
        console.log('Données soumises :', formData);
        console.log(e.target);
        let multi = false
        const obj = {}
        , ___formData = new FormData(e.target)
        , ___formData_Arr = Array.from(___formData)
        ___formData_Arr.forEach(r=>{
            // console.log(r[1] instanceof File);
            if(r[0]=="parents"){
                console.log("here");
                console.log(r[1]);
            }
            if(typeof r[1]=="object"){
                console.log("\n--\n");
                console.log(r[0]);
                console.log(r[1]);
                console.log(JSON.stringify(r[1]));
            }
            if(r[0].indexOf('_$_file')!==-1 && r[1].name){
                multi = true
                console.log(r[1]);
                // alert('fdsff',r[1].length)
            }
            if(datas){
                if(r[0].indexOf("_$_file")!==-1){
                    alert(r[1])
                    alert(r[1].name)
                    if(r[1].name)
                        obj[[r[0]]] = "/images/" +r[1].name.substring(0,r[1].name.lastIndexOf(".")) + "_"  + ___formData_Arr.find(elt=>elt[0]=="timestamp")[1] + r[1].name.substring(r[1].name.lastIndexOf("."))
                }else if(datas[r[0]]!=r[1])
                    obj[[r[0]]] = typeof r[1]=="object" 
                        ? JSON.stringify(r[1]) 
                        : r[1]
            }else obj[[r[0]]] = typeof r[1]=="object" 
                ? r[0].indexOf("_$_file")!==-1
                    ? "/images/" +r[1].name.substring(0,r[1].name.lastIndexOf(".")) + "_"  + ___formData_Arr.find(elt=>elt[0]=="timestamp")[1] + r[1].name.substring(r[1].name.lastIndexOf("."))
                    : JSON.stringify(r[1])
                : r[1]
        })
        
        const settings = {
            method: datas ? "PATCH" : "POST"
            , headers: {
                'Content-Type': 'application/json',
                // "Content-Type": "multipart/form-data",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
            , body: JSON.stringify(obj)
        }
        
        ___formData.append('ok',"khiuhu")
        console.log(___formData);
        console.log(Array.from(___formData));
        console.log(obj);
        alert(multi)
        alert(`/api/${endpoint?endpoint:modelKey}`+(datas?`?_id=${datas?._id}`:""))

        fetch(`/api/${endpoint?endpoint:modelKey}`+(datas?`?_id=${datas?._id}`:""), settings)
        .then(r=>r.json())
        .then(data=>{
            console.log(data);
            if(multi){
                console.log(datas);
                console.log(datas?.src_$_file);
                console.log(`/api/media`+(datas?`?type=${modelKey}&src=${datas?.src_$_file}`:""));
                console.log(obj);
                
                
                alert('in multi')
                settings.headers = {}
                settings.body = ___formData
                settings.method = "POST"
                const createdFilename = modelKey == "classe"
                    ? obj.annee+"___"+obj.niveau+"-"+obj.alias
                    : obj.nom+"_"+obj.prenoms
                console.log("modelKey: "+modelKey);
                console.log("createdFilename: "+createdFilename);
                
                
                fetch(`/api/media?type=${modelKey}s&createdFilename=${createdFilename}`+(datas?`&src=${datas?.src_$_file}`:""), settings)
                    .then(r=>r.json())
                    .then(dataMedia=>{
                        console.log(dataMedia);
                    })
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
            console.log(Array.from(document.forms).filter(f=>f.classList.contains("active"))[0]["adresse_$_map"]);
            
            Array.from(document.forms).filter(f=>f.classList.contains("active"))[0][mapFieldKey+"_"].value = JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) })
            // Update the formData for the hidden map input
            setFormData(prevFormData => ({
                ...prevFormData,
                // [mapFieldKey]: formData[mapFieldKey] + ";;;" + JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) })
                [mapFieldKey]: Array.from(document.forms).filter(f=>f.classList.contains("active"))[0][mapFieldKey].value + ";;;" + JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) })
            }));
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
        } else {
            setLatitude('');
            setLongitude('');
        }
    }, [datas]) // Re-run if datas changes

    return (
        <form onSubmit={handleSubmit} className={((modelKey=="teacher"||modelKey=="student")?"member ":"")+modelKey+(datas?"_update":"")}>
            <input type="hidden" name="modelKey" defaultValue={modelKey} />
            <input type="hidden" name="timestamp" defaultValue={formData.timestamp} />
            {/* { console.log(model) } */}
            {/* {datas && <input type="hidden" value={datas._id} name="_id" />} */}
            { Object.keys(model).map((key) => {if(model.hasOwnProperty(key) && key!="_id" && key!="__v"){
                
                // const { instance: type, default: defaultValue } = model[key];
                const { instance: fieldType } = model[key];
                // console.log(fieldType);
                // console.log(key);
                const _eval = eval((fieldType=="Mixed"||fieldType=="ObjectId")?"Object":fieldType)
                let defaultValue= model[key].options?.default || ""
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
                
                switch(inputType){
                    case"tel":
                    break;
                    case"email":
                    break;
                    case"date":
                    break;
                    case"checkbox":
                    break;
                    case"radio":
                    break;
                    case"map":
                        endLabel = <>
                            {!showMap&&<button type="button" onClick={
                                ({target}) => {
                                    setShowMap(true)
                                }
                            }>Choisir sur la carte</button>}
                            {showMap && <div key={key}>
                                {showMap&&<button type="button" onClick={e=>{setShowMap(false)}}>Fermer la carte</button>}
                                <p>{property_baseValue}:</p>
                                <input 
                                    type="hidden" 
                                    name={inputName+"_"}
                                    value={""} // Store as JSON string
                                    // defaultValue="{}"
                                />
                                <div className="form-group coordinates-group" style={{marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem'}}>
                                    <p>Coordonnées Géographiques: </p>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
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
                    case"file":
                        handleChange = ({target}) => {
                            if(target.files){
                                const file = target.files[0]
                                setSelectedImage(URL.createObjectURL(file))
                                setSelectedFile(file)
                            }
                        }
                        hidden = true
                        endLabel = <div>
                            {selectedImage ? (
                                <img src={selectedImage} alt="" />
                            ) : datas ? (
                                <span>Select Image (if not, same image will be saved --- funcionnalité encore non implementé ---)</span>
                            ) : (
                                <span>Select Image</span>
                            )
                        }
                        </div>
                    break;
                    case"hidden":
                        defaultValue = hiddens[inputName.split("_$_hidden")[0]] || defaultValue
                    break;
                    case"password":
                    break;
                    case"url":
                    break;
                    case"time":
                    break;
                    case"week":
                    break;
                    case"month":
                    break;
                    case"range":
                    break;
                    default:
                        if(inputType.split('_µ_')[0] == "ref"){
        
                            const joinedDataName = key.split('_$_')[1].split('_µ_')[1]
                            , joinedData = joinedDatasProps[joinedDataName]
                            , handleSingleChoice = (e) => {
        
                            }
                            , handleMultipleChoice = (e) => {
                                if(e.target.value!=""){
                                    document.getElementById(inputName).values = document.getElementById(inputName).values 
                                        ? document.getElementById(inputName).values.add(e.target.value) 
                                        : new Set([e.target.value])
                                    document.getElementById(inputName).value = Array.from(document.getElementById(inputName).values).join(',')
                                    document.getElementById(inputName+"_div").innerHTML = ""
                                    Array.from(document.getElementById(inputName).values).forEach(elt=>{
                                        let span = document.createElement('span')
                                        span.innerHTML = e.target.querySelectorAll('option')[e.target.selectedIndex].innerHTML
                                        span.addEventListener('click', ee=>{
                                            ee.stopPropagation()
                                            ee.target.remove(ee.target)
                                            e.selectedIndex=0
                                            document.getElementById(inputName).values.delete(elt)
                                        })
                                        document.getElementById(inputName+"_div").append(span)
                                    })
                                }
                            }
                            // console.log(joinedDatasProps);
                            // console.log(joinedDataName);
                            // console.log(joinedData);
        
                            switch(property_baseValue){
                                case"school_history": 
                                    add_btn = <>
                                        Année scolaire: 
                                        <input 
                                            type="text" 
                                            id={property_baseValue+"_date"} 
                                        /> ?
                                        <button onClick={e=>{
                                            let a = document.getElementById(property_baseValue+"_date").value
                                            if(a == parseInt(a) && a > 1990 && a < new Date().getFullYear()){
                                                defaultValue[a+'-'+(a+1)] = ""
                                            }else alert('Entrer une date valide/plausible svp')
                                        }}>+</button>
                                    </>
                                break
                                case"current_classe": 
                                case"professeur": 
                                    console.log("uhiuhiuh");
                                    console.log(joinedDatasProps);
                                    console.log(joinedDataName);
                                    console.log(joinedData);
                                    other_input_type = <>
                                        <select 
                                            name={inputName} 
                                            required={doRequiredInput&&true}
                                            defaultValue=""
                                        >
                                            <option value="">Choisir {joinedDataName}</option>
                                            {joinedData?.map((elt,i)=><option key={property_baseValue+"_"+i} value={elt._id}>{(elt.niveau&&elt.alias) ? elt.niveau+"-"+elt.alias : elt.nom+"-"+elt?.prenoms}</option>)}
                                        </select>
                                    </>
                                break;
                                case"bolobi_class_history": 
                                case"current_classes": 
                                case"eleves": 
                                    other_input_type = <>
                                        <select 
                                            onChange={handleMultipleChoice}
                                            required={doRequiredInput&&true}
                                            defaultValue=""
                                        >
                                            <option value="">Choisir {joinedDataName}</option>
                                            {joinedData?.map((elt,i)=><option key={property_baseValue+"_"+i} value={elt._id}>{(elt.niveau&&elt.alias) ? elt.niveau+"-"+elt.alias : elt.nom+"-"+elt?.prenoms}</option>)}
                                        </select>
                                        <div id={inputName+"_div"}></div>
                                        <input 
                                            type="hidden" 
                                            name={inputName} 
                                            id={inputName} 
                                            required={doRequiredInput&&true}
                                        />
                                    </>
                                break;
        
                                default:
                                    other_input_type = <>
                                        <select name={inputName} 
                                            required={doRequiredInput&&true}
                                        >
                                            <option selected>Choisir {joinedDataName}</option>
                                            {joinedData.map((elt,i)=><option key={property_baseValue+"_"+i} value={elt.id}>{elt.niveau}-{elt.alias}</option>)}
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
                            {fields_defaultValue[key.split('_$_')[0]]||key.split('_$_')[0]} (simple value):
                            <input
                                type={inputType}
                                name={inputName}
                                defaultValue={inputType=="hidden" 
                                    ? defaultValue
                                    :  datas
                                        ? datas[inputName]
                                        : inputType=="checkbox"
                                            ? undefined
                                            : defaultValue
                                }
                                placeholder={fields_placeholder[key] || defaultValue}
                                onChange={handleChange}
                                onClick={inputType=="checkbox" ? handleClickCheckbox : undefined}
                                // defaultChecked={inputType=="checkbox" ? model[key].defaultValue : undefined}
                                required={doRequiredInput&&true}
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
                            {fields_defaultValue[key.split('_$_')[0]]||key.split('_$_')[0]} (array):
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
                                required={doRequiredInput&&true}
                            />
                            
                        </label>
                    </div>);
                }

                if (_eval === Object)
                    if(!other_input_type) {
                        return (
                            <div key={key} className={key.split('_$_')[0]}>
                                <p>{fields_defaultValue[property_baseValue]||property_baseValue} (object):</p>
                                <input 
                                    type="hidden" 
                                    name={inputName}
                                    value={formData[inputName]}
                                    defaultValue={"{}"}
                                />
                                {Object.keys(defaultValue).map((subKey) => {
                                    // const subInputName = `${inputName}_*_${subKey}`;
                                    console.log(inputName+" "+defaultValue[subKey]);
                                    console.log(defaultValue);
                                    console.log(subKey);
                                    
                                    
                                    let checked = inputType=="checkbox" ? defaultValue[subKey] : ""
                                    return (
                                        <label key={subKey}>
                                            {fields_defaultValue[subKey]||subKey}:
                                            <input
                                                type={inputType}
                                                data-name={subKey}
                                                // value={formData[subInputName]}
                                                placeholder={fields_placeholder[subKey] || ""}
                                                onChange={(e)=>{handleObjectChange(e,inputName)}}
                                                defaultChecked={checked}
                                                // checked={inputType === 'checkbox' ? (formData[inputName]?.[subKey] ?? false) : undefined}
                                                required={doRequiredInput&&true}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        );
                    }else return (
                        <div key={key}>
                            {/* <p>{key.split('_$_')[0]}:</p> */}
                            {other_input_type}
                        </div>
                    )

                // Autres types de données non pris en charge
                return null;
            }})}

            <button type="submit">Créer</button>
            <hr />
            <div className="formDataDisplay">
                {JSON.stringify(formData)}
            </div>
        </form>
    );
};

export default StudentForm;
