



export default function FieldsetMeal({SectionCheckboxStyled, toggleFormNdrImg}) {
    return <fieldset className="meal">
        <h4 onClick={toggleFormNdrImg}>Choisir si vous souhaitez que les repas vous soient préparé (3000Fcfa/jour): </h4>
        <SectionCheckboxStyled>
            <label htmlFor="meal">
                <input type="checkbox" id="meal" name="meal" />
                <span>Repas Inclus 🍔 😋 🍲</span>
                <i className="indicator">
                    <svg version="1.1" id="toggle" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 33 33" xmlSpace="preserve"
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
                <span>Sans repas 🚫</span>
            </label>
        </SectionCheckboxStyled>
    </fieldset>
}
