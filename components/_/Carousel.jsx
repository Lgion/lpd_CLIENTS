import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"
import Slider from "react-slick";
import AuthContext from "../../stores/authContext.js"

import {carouselHome} from "../../assets/carousels.js"
// console.log(carouselHome)



//carousel simple: https://react-slick.neostack.com/
//carousel npm: https://www.npmjs.com/package/react-responsive-carousel
// 40 carousels comp: https://reactjsexample.com/tag/carousel/
// 14 carousels comp: https://alvarotrigo.com/blog/react-carousels/
// carousel comp: https://coreui.io/react/docs/components/carousel/
// carousel: https://www.gaji.jp/blog/2022/10/28/11858/
// spinner,bugger,carousel,countup,markdown: https://qiita.com/baby-degu/items/e183b20dd20b20920e00




export default function Carousel() {
    let {settingsSlider} = useContext(AuthContext)
    , [h3, setH3] = useState("TROUVER UN TITRE")
    , [random_indexes, setRandom_indexes] = useState(new Set())
    , myLoader = ({ src, width, quality }) => {
        return `${src}?w=${width}&q=${quality || 75}`
    }
    
    useEffect(() => {
        let random_indexes_ = random_indexes
        while(random_indexes_.size < 10) 
            random_indexes_.add(Math.ceil(Math.random()*carouselHome.length-1))
            //   random_indexes[index] = index
        setRandom_indexes(random_indexes_)
        console.log(random_indexes);
        console.log("TROUVER UN MOYEN D'AFFICHER DES IMAGES ALÉATOIRES DANS LE CAROUSEL")
    }, [])
    


    
    return <>
        <h3 className="carousel">{h3}</h3>
        <section className="carousel">
            <Slider {...settingsSlider}>
                <figure>
                    <h3>Un teste</h3>
                    <Link href="">lien ici</Link>
                </figure>
                {/* {this.setState({h2:carouselHome[0][1]})} */}
            {Array.from(random_indexes).map((item,i) => <figure key={"carousel"+i}>
                {/* {console.log(item)} */}
                <Image
                    loader={myLoader}
                    src={"/img/"+carouselHome[item][0]}
                    alt={" "+carouselHome[item][1]}
                    width={200}                                    height={200}
                />
                <figcaption>{carouselHome[item][1]}</figcaption>
            </figure>)}
            </Slider>
        </section>
    </>
}




