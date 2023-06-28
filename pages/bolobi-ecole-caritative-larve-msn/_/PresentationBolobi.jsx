import { useContext } from "react";
import Image from "next/image"
import Slider from "react-slick";
import AuthContext from "../../../stores/authContext.js"
import {carouselBolobi_} from "../../../assets/carousels.js"

export default function PresentationBolobi() {
    const {settingsSlider, myLoader} = useContext(AuthContext)
    let it

    
    return <article>
            <Slider {...settingsSlider} >
                {carouselBolobi_.map((value) =>{
                    for(it in value){
                        value = value[it].map((elt,i) => <section key={"carouselBolobi_"+i}>
                            <h1>{elt.h1}</h1>
                            <Image
                                loader={myLoader}
                                src={`/img/_/${it}/${elt.src}`}
                                alt={" "}
                                width={200} height={500}
                            />
                            <p>{elt.p}</p>
                            {/* <h1>DIAPORAMA EXPLOITATION AGRICOLTE (POIVRE, CACAO, AUTRES)</h1> */}
                        </section>)
                    }
                    return value
                })}
            </Slider>
    </article>
}
