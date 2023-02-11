import React from 'react'
import Image from "next/image"
import cartgif from "./cartGif.gif";


const EmptyCart = () => {

    const myLoader = ({ src, width, quality }) => {
        return `https://example.com/${src}?w=${width}&q=${quality || 75}`
    }
    return (
        <div className=' emptyCartMainParent text-center relative top-20'>

            <div id='fs'>
                <p className=' text-3xl fof uppercase ' id='fs'>Cart Is Empty Maybe Order Something :) </p>
            </div>

            <Image
                loader={myLoader}
                src={cartgif}
                alt={""}
                className=" absolute cg"
            />
        </div>
    )
}

export default EmptyCart