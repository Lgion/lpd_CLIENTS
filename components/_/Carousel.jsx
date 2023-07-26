import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"
import Slider from "react-slick";
import AuthContext from "../../stores/authContext.js"
import EditMongoForm from "../../pages/admin/school/EditMongoForm.jsx"

import {carouselHome} from "../../assets/carousels.js"
import {createPortal} from "react-dom"
// console.log(carouselHome)



//carousel simple: https://react-slick.neostack.com/
//carousel npm: https://www.npmjs.com/package/react-responsive-carousel
// 40 carousels comp: https://reactjsexample.com/tag/carousel/
// 14 carousels comp: https://alvarotrigo.com/blog/react-carousels/
// carousel comp: https://coreui.io/react/docs/components/carousel/
// carousel: https://www.gaji.jp/blog/2022/10/28/11858/
// spinner,bugger,carousel,countup,markdown: https://qiita.com/baby-degu/items/e183b20dd20b20920e00




export default function Carousel({diapos}) {
    let {settingsSlider} = useContext(AuthContext)
    , {isAdmin} = useContext(AuthContext)
    , [h3, setH3] = useState("TROUVER UN TITRE")
    , [random_indexes, setRandom_indexes] = useState(new Set())
    , [models, setModels] = useState({})
    , [currentDatas, setCurrentDatas] = useState({})
    , myLoader = ({ src, width, quality }) => {
        return `${src}?w=${width}&q=${quality || 75}`
    }
    , handleUpdate = (e,item) => {
        setCurrentDatas(diapos.find(r=>r._id==item._id))
        modal.classList.add('active')
        document.querySelectorAll('#modal .modal___main>form').forEach(elt=>{elt.classList.remove('active')})
        document.querySelector('#modal .modal___main>form.slider_update').classList.add('active')
    }
    , handleDelete = (e) => {
        console.log(e.target);
        console.log(e.target.dataset);
        const doSupp = confirm("Êtes-vous sûr de vouloir supprimer cette photo du diapo ?")
        if(doSupp)fetch(`/api/diapo?_id=${e.target.dataset._id}&src=${e.target.dataset.src}`, {
            method: "DELETE"
        })
    }
    // console.log(models);
    
    useEffect(() => {
        let ok = async () => {
          const ok = await fetch("/api/diapo")
          , data = await ok.json()
          console.log(data);
          setModels(data)
        }
        ok()
        let random_indexes_ = random_indexes
        while(random_indexes_.size < 10) 
            random_indexes_.add(Math.ceil(Math.random()*carouselHome.length-1))
            //   random_indexes[index] = index
        setRandom_indexes(random_indexes_)
        console.log(random_indexes);
        console.log("TROUVER UN MOYEN D'AFFICHER DES IMAGES ALÉATOIRES DANS LE CAROUSEL")
    }, [])
    


    
    return <>
        {isAdmin.toString()}
        { isAdmin && <>
            <button 
                title={"Ajouter une slide à votre diapo"}
                onClick={e=>{
                    modal.classList.add('active')
                    document.querySelector('#modal .modal___main>form.slider').classList.add('active')
                }}
            >+</button>
            {
                createPortal(
                    <EditMongoForm 
                        hiddens={{identifiant:"home_0"}}
                        endpoint="diapo"
                        modelKey={"slider"} 
                        model={models?.schemaDiapo?.paths || {}} 
                        // joinedDatasProps={{classes: ecole_classes}} 
                    />
                    , document.querySelector('#modal .modal___main')
                )
            }
            {
                createPortal(
                    <EditMongoForm 
                        hiddens={{identifiant:"home_0"}}
                        endpoint="diapo"
                        modelKey={"slider"} 
                        model={models?.schemaDiapo?.paths || {}} 
                        datas={currentDatas}
                        // joinedDatasProps={{classes: ecole_classes}} 
                    />
                    , document.querySelector('#modal .modal___main')
                )
            }
        </>}
        <h3 className="carousel">{h3}</h3>
        <section className="carousel">
            <Slider {...settingsSlider}>
                {/* {this.setState({h2:carouselHome[0][1]})} */}
                {diapos?.map((item,i) => <figure key={"carousel"+i}>
                {/*Array.from(random_indexes).map((item,i) => <figure key={"carousel"+i}>*/}
                    { isAdmin && <ul>
                        <li onClick={e=>{alert('ok');handleUpdate(e,item)}}>edit</li>
                        <li onClick={handleDelete} data-_id={item._id} data-src={item.src_$_file}>delete</li>
                    </ul>}
                    <Image
                        loader={myLoader}
                        src={item.src_$_file}
                        alt={item.alt}
                        title={item.title}
                        width={200}                                    height={200}
                    />
                    <figcaption>
                        <h3>{item.title}</h3>
                        <p>{item.figcaption}</p>
                    </figcaption>
                </figure>)}
            </Slider>
        </section>
    </>
}




