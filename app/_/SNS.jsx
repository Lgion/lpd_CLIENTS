import React, { useContext } from 'react'
import Link from "next/link";
import Image from "next/image"
import AuthContext from "../../stores/authContext.js"

export default function SNS() {

    const { myLoader } = useContext(AuthContext)
        , waMessage = "Bonjour Sanctuaire Notre Dame du Rosaire de Bolobi, je souhaite avoir des informations.";
    
    const directorPhone = process.env.NEXT_PUBLIC_DIRECTOR_WHATSAPP || "0779288293";
    const waUrl = `https://wa.me/+225${directorPhone}?text=${encodeURIComponent(waMessage)}`;

    const handleWaClick = () => {
        fetch('/api/whatsapp_relay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: waMessage, sender: 'Visiteur du site' })
        }).catch(err => console.error(err));
    };

    return (
        <menu className="SNS">
            {/* <li id="share">
                <button></button>
            </li> */}
            <li id="fb">
                {/* https://www.npmjs.com/package/react-facebook */}
                <a href="https://www.facebook.com/genevieve.achi/" target="_blank" rel="noopener noreferrer">
                </a>
            </li>
            <li id="whatsapp">
                <Link href={waUrl} target="_blank" rel="noopener noreferrer" onClick={handleWaClick}>
                </Link>
            </li>
            <li id="ytube">
                <a href="https://www.youtube.com/@puissancedivineabidjan2568" target="_blank" rel="noopener noreferrer">
                </a>
            </li>
            {/* <li id="instam">
                <a href="https://www.facebook.com/genevieve.achi/" target="_blank" rel="noopener noreferrer">
                </a>
            </li>
            <li id="tiktok">
                <a href="https://www.facebook.com/genevieve.achi/" title=" librairie puissance divine abidjan 2plateaux rue des jardins" target="_blank" rel="noopener noreferrer">
                </a>
            </li>*/}
            <li id="blogB">
                <a
                    href="blog"
                    rel="noreferrer"
                    target="_blank"
                    title="Blog du Sanctuaire notre Dame du Rosaire"
                >
                    {/* <span>bolobi.ci</span> */}
                    {/* <span>BLOG</span> */}
                </a>
            </li>
        </menu>
    )
}
