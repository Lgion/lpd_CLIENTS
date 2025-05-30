import { useState,useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaBuilding } from 'react-icons/fa';
import { SignInButton,SignedOut,useUser } from "@clerk/nextjs"

export default function FieldsetInfos({ toggleFormNdrImg, handleFieldsetValidation }) {
    const [infos, setInfos] = useState({
        community: 'aaa',
        names: '',
        phone_number: '0704763132',
        email: ''
    })
    , { user } = useUser()


    // Pré-remplir le formulaire quand l'utilisateur est connecté
    useEffect(() => {
        console.log(user);
        
        if (user) {
            setInfos(prevInfos => ({
                ...prevInfos,
                names: user.fullName || '',
                email: user.primaryEmailAddress?.emailAddress || '',
                phone_number: user.phoneNumbers?.[0] || prevInfos.phone_number,
                // La communauté n'est généralement pas disponible dans les données utilisateur par défaut
                community: user.publicMetadata?.community || prevInfos.community
            }))
        }
    }, [user])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfos(prevInfos => {
            
            // if(infos["community"])
            if(name=="community")
                // document.querySelector("article.infos>b").innerHTML = "Communauté: <b>"+infos["community"]+"</b>"
                document.querySelector("article.infos>b").innerHTML = "Communauté: <b>"+value+"</b>"

            return {
                ...prevInfos,
                [name]: value
            }
        }
    )
    };

    return (
        <fieldset className="active infos card mb-4 position-relative">
            {/* {JSON.stringify(infos)} */}
            <h4 className="mb-0">Informations générales</h4>
            {/* 
            <h5>Nous attendrons le <b>paiment wave</b> ou <b>OrangeMoney</b> via le numéro ci-mentionné,</h5>
            <h5>Nous vous enverrons un <b>email de confirmation</b> à l'adresse mentionné ci-dessous</h5> 
            */}
            <h5>Remplissez vos coordonnées de contact</h5>
            <h5>Puis, décrivez simplement ci-dessous l'objet de votre réservation</h5>
            <h5>Nous reçevrons un email, et vous rappelerons</h5>
            <div onClick={e=>{console.log(e.target.firstChild.click())}}className="formSignIn" title="Vous n'êtes pas connecté !">
                {!user ? <>
                    <SignedOut>
                        <SignInButton title="Se conncecter/S'incrire  pour remplir les informations de contact ?" type="button">Connexion ?</SignInButton>
                    </SignedOut>
                </>:""
                }
            </div>
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
                        // pattern="/^(\+225)?\d{8}$/" 
                        id="phone_number" 
                        name="phone_number" 
                        value={infos.phone_number}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label d-flex align-items-center">
                        <FaEnvelope className="me-2" />
                        Email de contact 
                        {/* <span className="text-danger">*</span> */}
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
            <div></div>
        </fieldset>
    );
}
