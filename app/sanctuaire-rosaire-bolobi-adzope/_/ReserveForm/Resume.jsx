import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { subDays, addDays, setHours, setMinutes, addMonths } from 'date-fns';




export default function Resume({dateRange,setDateRange,onChange}) {
    const [startDate, endDate] = dateRange
        , highlightWithRanges = [
            {
                "react-datepicker__day--highlighted-custom-1": [
                    subDays(new Date(), 4),
                    subDays(new Date(), 3),
                    subDays(new Date(), 2),
                    subDays(new Date(), 1),
                ],
            },
            {
                "react-datepicker__day--highlighted-custom-2": [
                    addDays(new Date(), 1),
                    addDays(new Date(), 2),
                    addDays(new Date(), 3),
                    addDays(new Date(), 4),
                ],
            },
        ]
        , filterPassedTime = (time) => {
            const selectedDate = new Date(time);

            return selectedDate.getHours() < 7 && selectedDate.getHours() > 22
        }
        , handleOnBlur = ({ target: { value } }) => {
            const date = new Date(value);
            if (isValid(date)) {
                console.log("date: %s", format(date, "dd/MM/yyyy"));
                alert(dateRange)
                setDateRange([startDate, endDate])
            } else {
                console.log("value: %s", date);
            }
        }
        , handleMealChange = (e) => {
            if (e.target.checked) {
                document.forms[2].meal.checked = true
                const a = e.target.parentNode.cloneNode(true)
                console.log(a)
                a.querySelector('input').remove()
                console.log(a)
                document.querySelector('p.meal b').innerHTML = a.textContent
            }
        }


    return <fieldset className="datepicker">
        <h4>RÉCAPITULATIF: </h4>
        <article className="type card">
            <h5>Type de <b>réservation</b>:</h5>
            <b>🚫</b>
        </article>
        <article className="nuites card">
            <h5>Nombre total (estimé)de <b>participants</b>:</h5>
            <b>🚫</b>
        </article>
        <article className="location card">
            <h5>Participants en chambre <b>collectives</b>:</h5>
            <b>🚫</b>
            <div className="card-footer">
                (3.000 Fcfa la nuit)
            </div> 
        </article>
        <article className="location_ind card">
            <h5>Participants en chambre  <b>individuelles</b>:</h5>
            <b>🚫</b> 
            <div>
                (10.000 Fcfa la nuit)
            </div>
        </article>
        <article className="meal card">
            <h5>Nombre de <b>repas</b>:</h5>
            <b>🚫</b>
            <div></div>
        </article>
        <article className="infos card">
            <h5>Réservation associé aux <b>coordonnées</b> suivantes: </h5>
            <b>🚫</b>
            <div></div>
        </article>

        <article className="dates card">
            <h5>Durée de la <b>réservation</b>:</h5>
            <b>🚫</b>
            <DatePicker
                // locale="fr-FR"
                // dateFormat="d MMMM yyyy, h:mm aa"
                dateFormat="d MMMM yyyy"
                selected={startDate}
                onChange={onChange}
                onBlur={handleOnBlur}
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                // filterTime={filterPassedTime}
                // minTime={setHours(setMinutes(new Date(), 0), 7)}
                // maxTime={setHours(setMinutes(new Date(), 30), 22)}              
                maxDate={addMonths(new Date(), 18)}
                timeIntervals={15}
                monthsShown={1}

                // placeholderText="blablabla"
                shouldCloseOnSelect={false}
                isClearable={true}
                selectsRange
                inline
                // showTimeSelect
                // showTimeInput
                // showMonthYearPicker
                // showFullMonthYearPicker


                // excludeDates={[addDays(new Date(), 25), addDays(new Date(), 26), addDays(new Date(), 27)]}
                highlightDates={highlightWithRanges}
                excludeDateIntervals={[{ start: addDays(new Date(), 25), end: addDays(new Date(), 27) }]}
                // includeDateIntervals={[{ start: addDays(new Date(), 22), end: addDays(new Date(), 24) },]}
                // calendarStartDay={new Date().getDate()}

                // dateFormat="MM/yyyy"
                todayButton="Réservation dates à Bolobi"
            />
        </article>

        
    </fieldset>
}
