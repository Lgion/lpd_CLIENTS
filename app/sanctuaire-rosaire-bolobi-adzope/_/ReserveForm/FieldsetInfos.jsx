import { useState,useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaBuilding } from 'react-icons/fa';
import { SignInButton,SignedOut,useUser } from "@clerk/nextjs"

export default function FieldsetInfos({ toggleFormNdrImg, handleFieldsetValidation }) {
    const [infos, setInfos] = useState({
        community: '',
        names: '',
        phone_number: '',
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
                phone_number: user.phoneNumbers?.[0] || '',
                // La communauté n'est généralement pas disponible dans les données utilisateur par défaut
                community: user.publicMetadata?.community || prevInfos.community
            }))
        }
    }, [user])

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
        <fieldset className="active infos card mb-4 position-relative">
            {/* {JSON.stringify(infos)} */}
            <h4 className="mb-0">Informations générales</h4>
            <h5>Nous attendrons le <b>paiment wave</b> ou <b>OrangeMoney</b> via le numéro ci-mentionné,</h5>
            <h5>Nous vous enverrons un <b>email de confirmation</b> à l'adresse mentionné ci-dessous</h5>
            <div>
                {!user ? <>
                    <div>Vous n'êtes pas connecté</div>
                    <SignedOut>
                        <SignInButton title="Se conncecter/S'incrire">Se connecter pour remplir les informations de contact ?</SignInButton>
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
                        Email de contact <span className="text-danger">*</span>
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
            <button 
              className="validate-button"
              onClick={(e) => {
                e.preventDefault();
                
                const names = document.querySelector('#names')?.value?.trim();
                const phone = document.querySelector('#phone_number')?.value?.trim();
                const email = document.querySelector('#email')?.value?.trim();
                
                // Vérifier si le nom est rempli
                if (!names) {
                  alert('Veuillez entrer votre nom');
                  return;
                }
                
                // Vérifier si le numéro de téléphone est valide
                const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
                if (!phone || !phoneRegex.test(phone)) {
                  alert('Veuillez entrer un numéro de téléphone valide');
                  return;
                }
                
                // Vérifier si l'email est valide
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || !emailRegex.test(email)) {
                  alert('Veuillez entrer une adresse email valide');
                  return;
                }
                
                // Si toutes les validations passent
                handleFieldsetValidation('infos');
              }}
            >
              Valider
            </button>
            <div className="cross-image d-none d-lg-block">
            </div>
        </fieldset>
    );
}
