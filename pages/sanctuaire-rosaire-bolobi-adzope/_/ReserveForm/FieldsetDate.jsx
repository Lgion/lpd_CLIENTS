



export default function fieldsetDate({handleDateChange}) {
    return <fieldset className="active dates">
        <h4>Choisir une période (du DD/MM/YYYY au DD/MM/YYYY): </h4>
        <label htmlFor="du">Du: *</label>
        <input type="date" id="du" name="du" onChange={handleDateChange} />
        <br />
        <label htmlFor="au">Au: *</label>
        <input type="date" id="au" name="au" onChange={handleDateChange} />
    </fieldset>
}
