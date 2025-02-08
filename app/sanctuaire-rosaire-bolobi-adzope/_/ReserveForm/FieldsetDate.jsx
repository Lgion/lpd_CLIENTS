"use client"

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

        document.querySelector(".dates div:last-of-type>b").innerHTML = (du.value && au.value) 
            ? dateDiffDuAu().day
            : 0

        handleDateChange()
    }
    , weekSelection = (e,weekNum) => {
        
        const range = getDateRangeOfWeek(weekNum)
        , e1={target:du}
        , e2={target:au}

        document.querySelector(".dates div b").innerHTML = 2

        document.querySelector(".dates ul li.on")?.classList.remove('on')
        e.target.classList.add('on')

        du.value = range[0]
        onChange(e1)
        au.value = range[1]
        onChange(e2)

        handleDateChange()
    }      
    , getDateRangeOfWeek = (weekNo=1, y=new Date().getFullYear()) => {
        // Commencer par le premier jour de l'année
        const d1 = new Date(y, 0, 1);
        // Ajuster au premier lundi de l'année
        d1.setDate(d1.getDate() + (1 - d1.getDay() || 7));
        // Avancer jusqu'à la semaine demandée
        d1.setDate(d1.getDate() + (weekNo - 1) * 7);
        // Avancer jusqu'au vendredi
        d1.setDate(d1.getDate() + 4);

        // Formater la date de début (vendredi)
        const prependMonthZero1 = (d1.getMonth() + 1) < 10 ? "0" : "";
        const prependDaysZero1 = d1.getDate() < 10 ? "0" : "";
        const rangeIsFrom = `${d1.getFullYear()}-${prependMonthZero1}${d1.getMonth() + 1}-${prependDaysZero1}${d1.getDate()}`;

        // Avancer de 2 jours pour le dimanche
        d1.setDate(d1.getDate() + 2);
        
        // Formater la date de fin (dimanche)
        const prependMonthZero2 = (d1.getMonth() + 1) < 10 ? "0" : "";
        const prependDaysZero2 = d1.getDate() < 10 ? "0" : "";
        const rangeIsTo = `${d1.getFullYear()}-${prependMonthZero2}${d1.getMonth() + 1}-${prependDaysZero2}${d1.getDate()}`;

        return [rangeIsFrom, rangeIsTo];
    }
    , getWeekendDates = (weekNum, year = new Date().getFullYear()) => {
        // Utiliser directement les dates retournées par getDateRangeOfWeek pour assurer la cohérence
        const [startDate, endDate] = getDateRangeOfWeek(weekNum, year);
        return {
            friday: moment(startDate).format('D MMM').toLowerCase(),
            sunday: moment(endDate).format('D MMM').toLowerCase()
        };
    }
    , dateWeek = (a) => {
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

    useEffect(()=>{
        // participants
        document.querySelectorAll('fieldset.datepicker p').forEach((item,i) => {
            item.addEventListener("click", e => {
                const tmp = e.target.className
                console.log(document.querySelector("fieldset"+(tmp&&"."+e.target.className)))
                console.log("li."+e.target.className)
                document.querySelector("li"+(tmp&&"."+e.target.className)).click()
            })
        })
        document.querySelector('fieldset.recap>article.dates>div').removeAttribute('style')

        // Initialiser les dates avec la semaine courante
        const e = { target: document.querySelector('li.on') };
        if (e.target) {
            weekSelection(e, currentWeekNum);
        }
    }, [])
    
    return <fieldset className="active dates">
        <h4 onClick={toggleFormNdrImg}>Choisir une période (du DD/MM/YYYY au DD/MM/YYYY): </h4>
        
        <p>Vous pouvez choisir une tranche de dates de votre spécifique, ou alors sélectionner un numéro de semaine (cas fréquent pour les retraites de groupe)</p>
        
        <div>
            <label htmlFor="du"><span></span></label>
            <input type="date" id="du" name="du" {...{onChange, onFocus}} required />
            <label htmlFor="au"><span></span></label>
            <input type="date" id="au" name="au" {...{onChange, onFocus}} required />
        </div>

        <ul onMouseOver={e => {e.target.querySelector('li.on')?.scrollIntoView({ behavior: "smooth", block: "center"})}}>
            <li>Weekends semaines {new Date().getFullYear()}: </li>
            {weeks_list.map((elt,i) => (i>=currentWeekNum) && <li 
                    key={i} 
                    onClick={ e=>weekSelection(e,i) } 
                    className={currentWeekNum==i ? "on" : ""} 
                >
                    <span>{i}</span>
                    <div><span>(du ven {getWeekendDates(i).friday})</span>   <span>(au dim {getWeekendDates(i).sunday})</span></div>
                </li>
            )}
        </ul>
        <div>Nombre de nuits: <b>0</b></div>
    </fieldset>
}
