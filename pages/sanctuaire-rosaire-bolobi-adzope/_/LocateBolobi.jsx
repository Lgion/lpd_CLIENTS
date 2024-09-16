import React, { useState, useEffect, useMemo } from "react"
import dynamic from 'next/dynamic'
import ReactImageZoom from 'react-image-zoom';
import ReactImageMagnify from 'react-image-magnify';
import 'leaflet/dist/leaflet.css'
// import watchImg300 from 


import Gmap from '../../../components/_/Gmap.jsx'
{/*
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'



function MapLeaflet() {
    const position = [51.505, -0.09]
        
    return(
      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    )
}
*/}

export default function LocateBolobi() {
    // const Map = React.useMemo(() => dynamic(
    //     () => import('./../../../components/_/MapLeaflet'), // replace '@components/map' with your component's location
    //     { ssr: false } // This line is important. It's what prevents server-side render
    // ), [])
    // const props = {width: 400, height: 250, zoomWidth: 2500, img: "/abidjan-adzope.png"}
    const props = {width: 400, height: 250, zoomWidth: 500, img: "celluloid-shot0002.jpg", offset: {vertical: 0, horizontal: 10}}
    , [did,setDid] = useState(0)
    , titreH3 = "OÙ SE SITUE LE SANCTUAIRE ND ROSAIRE DE BOLOBI"
    , sommaire = "GÉOLOCALISER BOLOBI"

    {/*}
    const Magnifier = React.useMemo(() => dynamic(

        () => import("./Magnifier.js"), // replace '@components/map' with your component's location
        { ssr: false } // This line is important. It's what prevents server-side render
      ), [])
    , Event = React.useMemo(() => dynamic(

        () => import("./Event.js"), // replace '@components/map' with your component's location
        { ssr: false } // This line is important. It's what prevents server-side render
      ), [])
    */}
    useEffect(()=>{
        // console.log(Event);
        console.log(did);
        setDid(1)
    }, [])
    useEffect(()=>{
        console.log("iiiiii");
        console.log(did);
        if(did){
            console.log("iooooo");
            let evt = new Event()
            , m = new Magnifier(evt)
            // let m = new Magnifier(ok)
            m.attach({
                thumb: '#thumb1',
                large: 'abidjan-adzope.png',
                largeWrapper: 'preview1',
                zoom: 3,
                zoomable: false
            })
        }
    },[did])
    return (
        <section>
            <h3 id="thirdH3" data-icon="3" data-sommaire={sommaire||titreH3}>{titreH3}</h3>
            <p>Le Sanctuaire ND Rosaire de Bolobi se situe à la périphérie d'Abidjan, juste après <a href="#" target="_blank">Azaguié</a>, un peu avant <a href="#" target="_blank">Yakasseme</a> (des panneaux indicateurs inscript "BOLOBI" pointent vers l'entrée du sanctuaire).</p>
            <div className="ndr_toggle">
                <button 
                    className="ndr_toggle_image_map_btn"
                    onClick={e=>{
                        let section = e.target.closest('section')
                        , ndr_image = section.querySelector('.ndr_image')
                        , ndr_map = section.querySelector('.ndr_map')
                        , span = e.target.closest('.ndr_toggle_image_map_btn').querySelector('span')
                        console.log(e.target.closest('.ndr_toggle_image_map_btn'));
                        console.log(e.target.closest('.ndr_toggle_image_map_btn').querySelector('span'));
                        ndr_image.classList.toggle('off')
                        ndr_map.classList.toggle('off')
                        if(ndr_image.classList.contains('off'))
                            span.innerText = "le plan routier"
                        else span.innerText = "Google Map"
                    }}
                >
                    Afficher <span>Google Map</span>
                </button>
            </div>
            <div className="ndr_image off">
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
        <div style={{width: 610, margin: "0 auto"}}>
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
            <div className="ndr_map">
			    <Gmap />
                {/* <MapLeaflet /> */}
            </div>
        </section>
    )
}



function Event() {
    "use strict";
    this.attach = function (evtName, element, listener, capture) {
        var evt         = '',
            useCapture  = (capture === undefined) ? true : capture,
            handler     = null;

        if (window.addEventListener === undefined) {
            evt = 'on' + evtName;
            handler = function (evt, listener) {
                element.attachEvent(evt, listener);
                return listener;
            };
        } else {
            evt = evtName;
            handler = function (evt, listener, useCapture) {
                element.addEventListener(evt, listener, useCapture);
                return listener;
            };
        }

        return handler.apply(element, [evt, function (ev) {
            var e   = ev || event,
                src = e.srcElement || e.target;

            listener(e, src);
        }, useCapture]);
    };

    this.detach = function (evtName, element, listener, capture) {
        var evt         = '',
            useCapture  = (capture === undefined) ? true : capture;

        if (window.removeEventListener === undefined) {
            evt = 'on' + evtName;
            element.detachEvent(evt, listener);
        } else {
            evt = evtName;
            element.removeEventListener(evt, listener, useCapture);
        }
    };

    this.stop = function (evt) {
        evt.cancelBubble = true;

        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
    };

    this.prevent = function (evt) {
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
    };
};
function Magnifier(evt, options) {
    "use strict";

    var gOptions = options || {},
        curThumb = null,
        curData = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            lensW: 0,
            lensH: 0,
            lensBgX: 0,
            lensBgY: 0,
            largeW: 0,
            largeH: 0,
            largeL: 0,
            largeT: 0,
            zoom: 2,
            zoomMin: 1.1,
            zoomMax: 5,
            mode: 'outside',
            largeWrapperId: (gOptions.largeWrapper !== undefined)
                ? (gOptions.largeWrapper.id || null)
                : null,
            status: 0,
            zoomAttached: false,
            zoomable: (gOptions.zoomable !== undefined)
                ? gOptions.zoomable
                : false,
            onthumbenter: (gOptions.onthumbenter !== undefined)
                ? gOptions.onthumbenter
                : null,
            onthumbmove: (gOptions.onthumbmove !== undefined)
                ? gOptions.onthumbmove
                : null,
            onthumbleave: (gOptions.onthumbleave !== undefined)
                ? gOptions.onthumbleave
                : null,
            onzoom: (gOptions.onzoom !== undefined)
                ? gOptions.onzoom
                : null
        },
        pos = {
            t: 0,
            l: 0,
            x: 0,
            y: 0
        },
        gId = 0,
        status = 0,
        curIdx = '',
        curLens = null,
        curLarge = null,
        gZoom = (gOptions.zoom !== undefined)
                    ? gOptions.zoom
                    : curData.zoom,
        gZoomMin = (gOptions.zoomMin !== undefined)
                    ? gOptions.zoomMin
                    : curData.zoomMin,
        gZoomMax = (gOptions.zoomMax !== undefined)
                    ? gOptions.zoomMax
                    : curData.zoomMax,
        gMode = gOptions.mode || curData.mode,
        data = {},
        inBounds = false,
        isOverThumb = 0,
        getElementsByClass = function (className) {
            var list = [],
                elements = null,
                len = 0,
                pattern = '',
                i = 0,
                j = 0;

            if (document.getElementsByClassName) {
                list = document.getElementsByClassName(className);
            } else {
                elements = document.getElementsByTagName('*');
                len = elements.length;
                pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");

                for (i, j; i < len; i += 1) {
                    if (pattern.test(elements[i].className)) {
                        list[j] = elements[i];
                        j += 1;
                    }
                }
            }

            return list;
        },
        $ = function (selector) {
            var idx = '',
                type = selector.charAt(0),
                result = null;

            if (type === '#' || type === '.') {
                idx = selector.substr(1, selector.length);
            }

            if (idx !== '') {
                switch (type) {
                case '#':
                    result = document.getElementById(idx);
                    break;
                case '.':
                    result = getElementsByClass(idx);
                    break;
                }
            }

            return result;
        },
        createLens = function (thumb, idx) {
            var lens = document.createElement('div');

            lens.id = idx + '-lens';
            lens.className = 'magnifier-loader';

            thumb.parentNode.appendChild(lens);
        },
        updateLensOnZoom = function () {
            curLens.style.left = pos.l + 'px';
            curLens.style.top = pos.t + 'px';
            curLens.style.width = curData.lensW + 'px';
            curLens.style.height = curData.lensH + 'px';
            curLens.style.backgroundPosition = '-' + curData.lensBgX + 'px -' +
                                                curData.lensBgY + 'px';

            curLarge.style.left = '-' + curData.largeL + 'px';
            curLarge.style.top = '-' + curData.largeT + 'px';
            curLarge.style.width = curData.largeW + 'px';
            curLarge.style.height = curData.largeH + 'px';
        },
        updateLensOnLoad = function (idx, thumb, large, largeWrapper) {
            var lens = $('#' + idx + '-lens'),
                textWrapper = null;

            if (data[idx].status === 1) {
                textWrapper = document.createElement('div');
                textWrapper.className = 'magnifier-loader-text';
                lens.className = 'magnifier-loader hidden';

                textWrapper.appendChild(document.createTextNode('Loading...'));
                lens.appendChild(textWrapper);
            } else if (data[idx].status === 2) {
                lens.className = 'magnifier-lens hidden';
                lens.removeChild(lens.childNodes[0]);
                lens.style.background = 'url(' + thumb.src + ') no-repeat 0 0 scroll';

                large.id = idx + '-large';
                large.style.width = data[idx].largeW + 'px';
                large.style.height = data[idx].largeH + 'px';
                large.className = 'magnifier-large hidden';

                if (data[idx].mode === 'inside') {
                    lens.appendChild(large);
                } else {
                    largeWrapper.appendChild(large);
                }
            }

            lens.style.width = data[idx].lensW + 'px';
            lens.style.height = data[idx].lensH + 'px';
        },
        getMousePos = function () {
            var xPos = pos.x - curData.x,
                yPos = pos.y - curData.y,
                t    = 0,
                l    = 0;

            inBounds = (
                xPos < 0 ||
                yPos < 0 ||
                xPos > curData.w ||
                yPos > curData.h
            )
                ? false
                : true;

            l = xPos - (curData.lensW / 2);
            t = yPos - (curData.lensH / 2);

            if (curData.mode !== 'inside') {
                if (xPos < curData.lensW / 2) {
                    l = 0;
                }

                if (yPos < curData.lensH / 2) {
                    t = 0;
                }

                if (xPos - curData.w + (curData.lensW / 2) > 0) {
                    l = curData.w - (curData.lensW + 2);
                }

                if (yPos - curData.h + (curData.lensH / 2) > 0) {
                    t = curData.h - (curData.lensH + 2);
                }
            }

            pos.l = Math.round(l);
            pos.t = Math.round(t);

            curData.lensBgX = pos.l + 1;
            curData.lensBgY = pos.t + 1;

            if (curData.mode === 'inside') {
                curData.largeL = Math.round(xPos * (curData.zoom - (curData.lensW / curData.w)));
                curData.largeT = Math.round(yPos * (curData.zoom - (curData.lensH / curData.h)));
            } else {
                curData.largeL = Math.round(curData.lensBgX * curData.zoom * (curData.largeWrapperW / curData.w));
                curData.largeT = Math.round(curData.lensBgY * curData.zoom * (curData.largeWrapperH / curData.h));
            }
        },
        zoomInOut = function (e) {
            var delta = (e.wheelDelta > 0 || e.detail < 0) ? 0.1 : -0.1,
                handler = curData.onzoom,
                multiplier = 1,
                w = 0,
                h = 0;

            if (e.preventDefault) {
                e.preventDefault();
            }

            e.returnValue = false;

            curData.zoom = Math.round((curData.zoom + delta) * 10) / 10;

            if (curData.zoom >= curData.zoomMax) {
                curData.zoom = curData.zoomMax;
            } else if (curData.zoom >= curData.zoomMin) {
                curData.lensW = Math.round(curData.w / curData.zoom);
                curData.lensH = Math.round(curData.h / curData.zoom);

                if (curData.mode === 'inside') {
                    w = curData.w;
                    h = curData.h;
                } else {
                    w = curData.largeWrapperW;
                    h = curData.largeWrapperH;
                    multiplier = curData.largeWrapperW / curData.w;
                }

                curData.largeW = Math.round(curData.zoom * w);
                curData.largeH = Math.round(curData.zoom * h);

                getMousePos();
                updateLensOnZoom();

                if (handler !== null) {
                    handler({
                        thumb: curThumb,
                        lens: curLens,
                        large: curLarge,
                        x: pos.x,
                        y: pos.y,
                        zoom: Math.round(curData.zoom * multiplier * 10) / 10,
                        w: curData.lensW,
                        h: curData.lensH
                    });
                }
            } else {
                curData.zoom = curData.zoomMin;
            }
        },
        onThumbEnter = function () {
            curData = data[curIdx];
            curLens = $('#' + curIdx + '-lens');

            if (curData.status === 2) {
                curLens.className = 'magnifier-lens';

                if (curData.zoomAttached === false) {
                    if (curData.zoomable !== undefined && curData.zoomable === true) {
                        evt.attach('mousewheel', curLens, zoomInOut);

                        if (window.addEventListener) {
                            curLens.addEventListener('DOMMouseScroll', function (e) {
                                zoomInOut(e);
                            });
                        }
                    }

                    curData.zoomAttached = true;
                }

                curLarge = $('#' + curIdx + '-large');
                curLarge.className = 'magnifier-large';
            } else if (curData.status === 1) {
                curLens.className = 'magnifier-loader';
            }
        },
        onThumbLeave = function () {
            if (curData.status > 0) {
                var handler = curData.onthumbleave;

                if (handler !== null) {
                    handler({
                        thumb: curThumb,
                        lens: curLens,
                        large: curLarge,
                        x: pos.x,
                        y: pos.y
                    });
                }

                if (curLens.className.indexOf('hidden') === -1) {
                    curLens.className += ' hidden';
                    curThumb.className = curData.thumbCssClass;

                    if (curLarge !== null) {
                        curLarge.className += ' hidden';
                    }
                }
            }
        },
        move = function () {
            if (status !== curData.status) {
                onThumbEnter();
            }

            if (curData.status > 0) {
                curThumb.className = curData.thumbCssClass + ' opaque';

                if (curData.status === 1) {
                    curLens.className = 'magnifier-loader';
                } else if (curData.status === 2) {
                    curLens.className = 'magnifier-lens';
                    curLarge.className = 'magnifier-large';
                    curLarge.style.left = '-' + curData.largeL + 'px';
                    curLarge.style.top = '-' + curData.largeT + 'px';
                }

                curLens.style.left = pos.l + 'px';
                curLens.style.top = pos.t + 'px';
                curLens.style.backgroundPosition = '-' +
                                                curData.lensBgX + 'px -' +
                                                curData.lensBgY + 'px';

                var handler = curData.onthumbmove;

                if (handler !== null) {
                    handler({
                        thumb: curThumb,
                        lens: curLens,
                        large: curLarge,
                        x: pos.x,
                        y: pos.y
                    });
                }
            }

            status = curData.status;
        },
        setThumbData = function (thumb, thumbData) {
            var thumbBounds = thumb.getBoundingClientRect(),
                w = 0,
                h = 0;

            thumbData.x = thumbBounds.left;
            thumbData.y = thumbBounds.top;
            thumbData.w = Math.round(thumbBounds.right - thumbData.x);
            thumbData.h = Math.round(thumbBounds.bottom - thumbData.y);

            thumbData.lensW = Math.round(thumbData.w / thumbData.zoom);
            thumbData.lensH = Math.round(thumbData.h / thumbData.zoom);

            if (thumbData.mode === 'inside') {
                w = thumbData.w;
                h = thumbData.h;
            } else {
                w = thumbData.largeWrapperW;
                h = thumbData.largeWrapperH;
            }

            thumbData.largeW = Math.round(thumbData.zoom * w);
            thumbData.largeH = Math.round(thumbData.zoom * h);
        };

    this.attach = function (options) {
        if (options.thumb === undefined) {
            throw {
                name: 'Magnifier error',
                message: 'Please set thumbnail',
                toString: function () {return this.name + ": " + this.message; }
            };
        }

        var thumb = $(options.thumb),
            i = 0;

        if (thumb.length !== undefined) {
            for (i; i < thumb.length; i += 1) {
                options.thumb = thumb[i];
                this.set(options);
            }
        } else {
            options.thumb = thumb;
            this.set(options);
        }
    };

    this.setThumb = function (thumb) {
        curThumb = thumb;
    };

    this.set = function (options) {
        if (data[options.thumb.id] !== undefined) {
            curThumb = options.thumb;
            return false;
        }

        var thumbObj    = new Image(),
            largeObj    = new Image(),
            thumb       = options.thumb,
            idx         = thumb.id,
            zoomable    = null,
            largeUrl    = null,
            largeWrapper = (
                $('#' + options.largeWrapper) ||
                $('#' + thumb.getAttribute('data-large-img-wrapper')) ||
                $('#' + curData.largeWrapperId)
            ),
            zoom = options.zoom || thumb.getAttribute('data-zoom') || gZoom,
            zoomMin = options.zoomMin || thumb.getAttribute('data-zoom-min') || gZoomMin,
            zoomMax = options.zoomMax || thumb.getAttribute('data-zoom-max') || gZoomMax,
            mode = options.mode || thumb.getAttribute('data-mode') || gMode,
            onthumbenter = (options.onthumbenter !== undefined)
                        ? options.onthumbenter
                        : curData.onthumbenter,
            onthumbleave = (options.onthumbleave !== undefined)
                        ? options.onthumbleave
                        : curData.onthumbleave,
            onthumbmove = (options.onthumbmove !== undefined)
                        ? options.onthumbmove
                        : curData.onthumbmove,
            onzoom = (options.onzoom !== undefined)
                        ? options.onzoom
                        : curData.onzoom;

        if (options.large === undefined) {
            largeUrl = (options.thumb.getAttribute('data-large-img-url') !== null)
                            ? options.thumb.getAttribute('data-large-img-url')
                            : options.thumb.src;
        } else {
            largeUrl = options.large;
        }

        if (largeWrapper === null && mode !== 'inside') {
            throw {
                name: 'Magnifier error',
                message: 'Please specify large image wrapper DOM element',
                toString: function () {return this.name + ": " + this.message; }
            };
        }

        if (options.zoomable !== undefined) {
            zoomable = options.zoomable;
        } else if (thumb.getAttribute('data-zoomable') !== null) {
            zoomable = (thumb.getAttribute('data-zoomable') === 'true');
        } else if (curData.zoomable !== undefined) {
            zoomable = curData.zoomable;
        }

        if (thumb.id === '') {
            idx = thumb.id = 'magnifier-item-' + gId;
            gId += 1;
        }

        createLens(thumb, idx);

        data[idx] = {
            zoom: zoom,
            zoomMin: zoomMin,
            zoomMax: zoomMax,
            mode: mode,
            zoomable: zoomable,
            thumbCssClass: thumb.className,
            zoomAttached: false,
            status: 0,
            largeUrl: largeUrl,
            largeWrapperId: mode === 'outside' ? largeWrapper.id : null,
            largeWrapperW: mode === 'outside' ? largeWrapper.offsetWidth : null,
            largeWrapperH: mode === 'outside' ? largeWrapper.offsetHeight : null,
            onzoom: onzoom,
            onthumbenter: onthumbenter,
            onthumbleave: onthumbleave,
            onthumbmove: onthumbmove
        };

        evt.attach('mouseover', thumb, function (e, src) {
            if (curData.status !== 0) {
                onThumbLeave();
            }

            curIdx = src.id;
            curThumb = src;

            onThumbEnter(src);

            setThumbData(curThumb, curData);

            pos.x = e.clientX;
            pos.y = e.clientY;

            getMousePos();
            move();

            var handler = curData.onthumbenter;

            if (handler !== null) {
                handler({
                    thumb: curThumb,
                    lens: curLens,
                    large: curLarge,
                    x: pos.x,
                    y: pos.y
                });
            }
        }, false);

        evt.attach('mousemove', thumb, function (e, src) {
            isOverThumb = 1;
        });

        evt.attach('load', thumbObj, function () {
            data[idx].status = 1;

            setThumbData(thumb, data[idx]);
            updateLensOnLoad(idx);

            evt.attach('load', largeObj, function () {
                data[idx].status = 2;
                updateLensOnLoad(idx, thumb, largeObj, largeWrapper);
            });

            largeObj.src = data[idx].largeUrl;
        });

        thumbObj.src = thumb.src;
    };

    evt.attach('mousemove', document, function (e) {
        pos.x = e.clientX;
        pos.y = e.clientY;

        getMousePos();

        if (inBounds === true) {
            move();
        } else {
            if (isOverThumb !== 0) {
                onThumbLeave();
            }

            isOverThumb = 0;
        }
    }, false);

    evt.attach('scroll', window, function () {
        if (curThumb !== null) {
            setThumbData(curThumb, curData);
        }
    });
};