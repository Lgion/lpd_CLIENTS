import { useState, useEffect } from "react"
import moment from "moment"

moment.locale('fr')



export default function fieldsetDate({handleDateChange,toggleFormNdrImg,dateDiffDuAu}) {
    const [isWeek, setIsWeek] = useState(false)
    , onFocus = e => e.target.showPicker()
    , onChange = e => {
        const label = e.target.parentNode.querySelector("label[for="+e.target.id+"]")
        , span = e.target.parentNode.querySelector("label[for="+e.target.id+"] span")
        , tmp = moment(e.target.value)
        span.innerHTML = tmp.format('LL')

        // console.log(du.value);
        // console.log(au.value);
        // console.log(dateDiffDuAu());
        document.querySelector(".dates div div>b").innerHTML = (du.value && au.value) 
            ? dateDiffDuAu().day
            : 0

        handleDateChange()
    }
    , weekSelection = (e,weekNum) => {
        
        const range = getDateRangeOfWeek(weekNum)
        // console.log(getDateRangeOfWeek(weekNum));
        , e1={target:du}
        , e2={target:au}

        document.querySelector(".dates div div b").innerHTML = 2

        document.querySelector(".dates ul li.on").classList.remove('on')
        e.target.classList.add('on')

        du.value = range[0]// LE JOUR D'ARRIVEE CORRESPONDANT AU NUMÉRO DE SEMAINE SÉLECTIONNÉ
        onChange(e1)
        au.value = range[1]// LE JOUR DE DÉPART CORRESPONDANT AU NUMÉRO DE SEMAINE SÉLECTIONNÉ
        onChange(e2)
        // console.log(du.value);
        // console.log(au.value);

        handleDateChange()

    }      
    , getDateRangeOfWeek = (weekNo=1, y=new Date().getFullYear()) => {
        var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
        d1 = new Date(''+y+'');
        numOfdaysPastSinceLastMonday = d1.getDay() - 1;
        d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
        console.log(typeof d1.getDate());
        d1.setDate(d1.getDate() + (7 * (weekNo - d1.getWeek())));
        let prependMonthZero = (d1.getMonth() + 1) < 10 ? "0" : ""
        let prependDaysZero = (d1.getDate()) < 10 ? "0" : ""
        rangeIsFrom = d1.getFullYear() + "-" + prependMonthZero+(d1.getMonth() + 1) + "-" + prependDaysZero+d1.getDate();
        d1.setDate(d1.getDate() + 6);
        prependMonthZero = (d1.getMonth() + 1) < 10 ? "0" : ""
        prependDaysZero = (d1.getDate()) < 10 ? "0" : ""
        rangeIsTo = d1.getFullYear() + "-" + prependMonthZero+(d1.getMonth() + 1) + "-" + prependDaysZero+d1.getDate();
        return [rangeIsFrom, rangeIsTo];
    }
    , dateWeek = (a) => {
        // CODE FONCITON RÉCUPÉRÉ SUR: https://www.equinode.com/fonctions-javascript/obtenir-le-numero-de-semaine-d-une-date-avec-javascript#:~:text=La%20fonction%20dateWeek()%20permet,de%20semaine%20d'une%20date.
        var d = a ? new Date(a) : new Date();
        d.setHours(0,0,0,0);
        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
        var w = new Date(d.getFullYear(), 0, 4);
        return ('0' + (1 + Math.round(((d.getTime() - w.getTime()) / 86400000 - 3 + (w.getDay() + 6) % 7) / 7))).slice(-2);
    }
    , currentWeekNum = dateWeek(new Date())
    , weeks_list = []
    
    weeks_list.length = 54
    weeks_list.fill(0).map((elt,i)=>i+1)

    Date.prototype.getWeek = function() {
        var date = new Date(this.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        var week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }
    
    

    
    return <fieldset className="active dates">
        <h4 onClick={toggleFormNdrImg}>Choisir une période (du DD/MM/YYYY au DD/MM/YYYY): </h4>
        
        {/* <div>
            <input
                type="checkbox"
                name="isWeek"
                id="isWeekInput"
                value={isWeek}
                onChange={e=>setIsWeek(e.target.checked)}
            />
        </div> */}
        <p>Vous pouvez choisir une tranche de dates de votre spécifique, ou alors sélectionner un numéro de semaine (cas fréquent pour les retraites de groupe)</p>
        <ul onMouseOver={e => {e.target.querySelector('li.on')?.scrollIntoView({ behavior: "smooth", block: "center"})}}>
            <li>SEMAINES {new Date().getFullYear()}: </li>
            {weeks_list.map((elt,i) => (i>=currentWeekNum) && <li 
                    key={i} 
                    onClick={ e=>weekSelection(e,i) } 
                    className={currentWeekNum==i ? "on" : ""} 
                >
                    {i} 
                </li>
            )}
        </ul>
        <div>
            <label htmlFor="du"><span></span></label>
            <input type="date" id="du" name="du" {...{onChange, onFocus}} />
            <label htmlFor="au"><span></span></label>
            <input type="date" id="au" name="au" {...{onChange, onFocus}} />
            <div>Nombre de nuits: <b>0</b></div>
        </div>


        {/* {isWeek ? <>
            <label htmlFor="du">Du: *</label>
            <input type="date" id="du" name="du" onChange={handleDateChange} />
            <br />
            <label htmlFor="au">Au: *</label>
            <input type="date" id="au" name="au" onChange={handleDateChange} />
        </>
        :
        <>
            <label htmlFor="du">Weekend du ||| au ||| (Semaine n°) : *</label>
            <input type="date" id="du" name="du" />
        </>
        } */}
    </fieldset>
}
