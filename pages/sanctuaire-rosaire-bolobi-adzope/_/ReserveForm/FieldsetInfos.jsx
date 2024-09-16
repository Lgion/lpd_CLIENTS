




export default function FieldsetInfos() {
    return <fieldset className="infos">
        <h4>Informations générales: </h4>
        <label htmlFor="community">Communauté:
            <input type="text" id="community" name="community" />
        </label>
        <br />
        <label htmlFor="names">Nom, Prénoms du responsable <span className="alert">*</span>:
            <input type="text" id="names" name="names" required />
        </label>
        <br />
        <label htmlFor="phone_number">Numéro de contact <span className="alert">*</span>:
            <input type="tel" pattern="/^(\+225)?\d{8}$/" id="phone_number" name="phone_number" required />
        </label>
        <br />
        <label htmlFor="email">Email de contact:
            <input type="email" id="email" name="email" />
        </label>
    </fieldset>
}
