"use client"

import { useState } from 'react';

const fields_placeholder = {
    nom: "ex: Smith"
    , prenoms: "ex: John, Junior"
    , naissance: "JJ-MM-YYYY"
    , mere: "ex: Smith, Johana, Jane"
    , pere: "ex: Smith, John, Senior"
}
, default_input_placeholder = "___default_text___"
, doRequiredInput = false


const StudentForm = ({ model, modelKey, joinedDatasProps, endpoint, hiddens={}, datas }) => {
    // console.log(model);
    // console.log(datas);
    const [formData, setFormData] = useState({timestamp: +new Date()})
    , [selectedImage, setSelectedImage] = useState("")
    , [selectedFile, setSelectedFile] = useState({})

    let handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: files?.[0] || value,
        }))
    }
    , handleObjectChange = (e, inputName) => {
        const { value } = e.target
        , subName = e.target.dataset.name
        setFormData((prevFormData) => {
            // let subName = name.split('_*_')[1]
            return {
                ...prevFormData,
                [inputName]: JSON.stringify(
                    prevFormData?.[inputName] 
                        ? {...JSON.parse(prevFormData?.[inputName]), [subName]: value }
                        : {[subName]: value}
                )
            }
        })
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
                alert('fdsff',r[1].length)
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

        fetch(`/api/${endpoint?endpoint:modelKey}`+(datas?`?_id=${datas?._id}`:""), settings)
        .then(r=>r.json())
        .then(data=>{
            console.log(data);
            if(multi){
                console.log(datas);
                console.log(datas?.src_$_file);
                alert('in multi')
                settings.headers = {}
                settings.body = ___formData
                settings.method = "POST"
                fetch(`/api/media`+(datas?`?src=${datas?.src_$_file}`:""), settings)
                    .then(r=>r.json())
                    .then(dataMedia=>{
                        console.log(dataMedia);
                    })
            }
        })

        // Réinitialiser les champs du formulaire
        setFormData({});
    };
    const getTimestamp = () => {
        return Date.now();
    };
    // console.log(hiddens);

    return (
        <form onSubmit={handleSubmit} className={modelKey+(datas?"_update":"")}>
            <input type="hidden" name="modelKey" defaultValue={modelKey} />
            <input type="hidden" name="timestamp" defaultValue={formData.timestamp} />
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
                let other_input_type = false
                , checked = ""
                , add_btn = ""

                // console.log(key);
                // console.log(fieldType);
                // console.log(defaultValue);
                // console.log(_eval);
                // console.log(model[key]);
                // console.log(model[key].options?.default);
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
                                            {joinedData.map((elt,i)=><option key={property_baseValue+"_"+i} value={elt.id}>{(elt.niveau&&elt.alias) ? elt.niveau+"-"+elt.alias : elt.nom+"-"+elt.prenoms.join("-")}</option>)}
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
                                            {joinedData.map((elt,i)=><option key={property_baseValue+"_"+i} value={elt.id}>{(elt.niveau&&elt.alias) ? elt.niveau+"-"+elt.alias : elt.nom+"-"+elt.prenoms.join("-")}</option>)}
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
                    return (
                        <label key={key}>
                            {key.split('_$_')[0]} aa:
                            <input
                                type={inputType}
                                name={inputName}
                                defaultValue={inputType=="hidden" 
                                    ? defaultValue
                                    :  datas
                                        ? datas[inputName]
                                        : defaultValue
                                }
                                placeholder={fields_placeholder[key] || defaultValue}
                                onChange={handleChange}
                                required={doRequiredInput&&true}
                                hidden={hidden}
                            />
                            {endLabel}
                        </label>
                    );
                }

                if (_eval === Array) {
                    return (
                        <label key={key}>
                            {key.split('_$_')[0]} ii:
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
                    );
                }

                if (_eval === Object)
                    if(!other_input_type) {
                        return (
                            <div key={key}>
                                <p>{property_baseValue} oo:</p>
                                <input 
                                    type="hidden" 
                                    name={inputName}
                                    value={formData[inputName]}
                                    defaultValue={"{}"}
                                />
                                {Object.keys(defaultValue).map((subKey) => {
                                    // const subInputName = `${inputName}_*_${subKey}`;
                                    let checked = inputType=="checkbox" ? defaultValue[subKey] : ""
                                    return (
                                        <label key={subKey}>
                                            {subKey}:
                                            <input
                                                type={inputType}
                                                data-name={subKey}
                                                // value={formData[subInputName]}
                                                placeholder={fields_placeholder[subKey] || ""}
                                                onChange={(e)=>{handleObjectChange(e,inputName)}}
                                                checked={checked}
                                                required={doRequiredInput&&true}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        );
                    }else return (
                        <div key={key}>
                            <p>{key.split('_$_')[0]} oo^^:</p>
                            {other_input_type}
                        </div>
                    )

                // Autres types de données non pris en charge
                return null;
            }})}

            <button type="submit">Créer</button>
        </form>
    );
};

export default StudentForm;
