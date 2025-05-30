


export default function NdrImage() {
    return <div className="ndr_image off">
        {/*
https://github.com/AndersDJohnson/magnificent.js
https://github.com/mark-rolich/Magnifier.js
        https://github.com/jackmoore/wheelzoom
    
        https://www.google.com/search?q=npm+react+next+zoom+loop+image&sxsrf=APwXEddFlF3HFg-ksm33etjMNDkALDjnUA%3A1685628109413&ei=zaR4ZPrrGIKokdUPxZe8wAQ&ved=0ahUKEwi6hr2FnqL_AhUCVKQEHcULD0gQ4dUDCA8&uact=5&oq=npm+react+next+zoom+loop+image&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIKCAAQRxDWBBCwAzIKCAAQRxDWBBCwAzIKCAAQRxDWBBCwAzIKCAAQRxDWBBCwAzIKCAAQRxDWBBCwAzIKCAAQRxDWBBCwAzIKCAAQRxDWBBCwAzIKCAAQRxDWBBCwA0oECEEYAFC-AViQCGCqCmgBcAF4AIABsQOIAcYLkgEFMy0zLjGYAQCgAQHAAQHIAQg&sclient=gws-wiz-serp
        https://morioh.com/p/bca9c144354c
            https://bashooka.com/coding/21-zoom-javascript-libraries-for-web-mobile/?ref=morioh.com&utm_source=morioh.com 
        https://github.com/infeng/react-viewer
        https://github.com/prc5/react-zoom-pan-pinch#readme
    */}
        {/* https://www.npmjs.com/package/react-image-magnify */}
        <div style={{ width: 610, margin: "0 auto" }}>
            <img id="thumb1" src="abidjan-adzope.png" />
            <div className="magnifier-preview example heading" id="preview1">Starry Night Over The Rhone<br />by Vincent van Gogh</div>
        </div>

        {/* <ReactImageZoom {...props} /> */}
        {/* <ReactImageMagnify {...{
            smallImage: {
                alt: 'Wristwatch by Ted Baker London',
                isFluidWidth: true,
                src: "celluloid-shot0002.jpg"
            },
            largeImage: {
                src: "abidjan-adzope.png",
                width: 500,
                height: 500
            }
        }} /> */}
        {/* <img src="/abidjan-adzope.png" alt="" /> */}
    </div>
}