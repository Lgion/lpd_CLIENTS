import React, { Component } from "react"
import Slider from "react-slick"
import Image from "next/image"
import {carousel} from "../assets/carousel.js"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default class SimpleSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }
    , random_indexes = []
    , myLoader = ({ src, width, quality }) => {
      return `https://example.com/${src}?w=${width}&q=${quality || 75}`
    }
    for (let index = 0; index < 10; index++) 
        random_indexes[index] = Math.ceil(Math.random()*carousel.length-1)
    // alert(random_indexes)
    console.log("iohohh")
    return (
      <div>
        <h2> Single Item</h2>
        <Slider {...settings}>
            {random_indexes.map((item,i) => <figure key={i}>
                {/* {this.setState({h2:carousel[0][1]})} */}
                {/* {console.log(item)} */}
                <h3>{i}</h3>
                <Image
                  loader={myLoader}
                  src={"/img/"+carousel[item][0]}
                  alt={carousel[item][1]}
                  width={555}
                />
            </figure>)}
        </Slider>
      </div>
    );
  }
}