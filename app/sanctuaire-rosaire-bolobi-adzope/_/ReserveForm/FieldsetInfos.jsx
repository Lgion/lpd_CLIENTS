import { useState,useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaBuilding } from 'react-icons/fa';

export default function FieldsetInfos({ toggleFormNdrImg }) {
    const [infos, setInfos] = useState({
        community: '',
        names: '',
        phone_number: '',
        email: ''
    });


    useEffect(() => {
        const div = document.querySelector('article.infos>div')
        let tmp = ""
        // if(infos["community"])tmp += "<span>Community: <b>"+infos["community"]+"</b></span>"
        if(infos["names"])tmp += "<span>Responsable: <b>"+infos["names"]+"</b></span>"
        if(infos["phone_number"])tmp += "<span>Téléphone: <b>"+infos["phone_number"]+"</b></span>" 
        if(infos["email"])tmp += "<span>Email: <b>"+infos["email"]+"</b></span>" 
        div.innerHTML = tmp

        document.querySelector('article.infos>b')
    }, [infos]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfos(prevInfos => {
            
            if(infos["community"])
                document.querySelector("article.infos>b").innerHTML = "Communauté: <b>"+infos["community"]+"</b>"
            return {
                ...prevInfos,
                [name]: value
            }
        }
    )
    };

    return (
        <fieldset className="infos card mb-4 position-relative">
            {JSON.stringify(infos)}
            <h4 className="mb-0">Informations générales</h4>
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="community" className="form-label d-flex align-items-center">
                        <FaBuilding className="me-2" />
                        Communauté
                    </label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="community" 
                        name="community" 
                        value={infos.community}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="names" className="form-label d-flex align-items-center">
                        <FaUser className="me-2" />
                        Nom, Prénoms du responsable <span className="text-danger">*</span>
                    </label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="names" 
                        name="names" 
                        required 
                        value={infos.names}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone_number" className="form-label d-flex align-items-center">
                        <FaPhone className="me-2" />
                        Numéro de contact <span className="text-danger">*</span>
                    </label>
                    <input 
                        type="tel" 
                        className="form-control" 
                        pattern="/^(\+225)?\d{8}$/" 
                        id="phone_number" 
                        name="phone_number" 
                        required 
                        value={infos.phone_number}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label d-flex align-items-center">
                        <FaEnvelope className="me-2" />
                        Email de contact
                    </label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        name="email" 
                        value={infos.email}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="cross-image d-none d-lg-block">
            </div>
        </fieldset>
    );
}
