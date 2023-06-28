// npm install @googlemaps/react-wrapper
import React from 'react'
import { Wrapper, Status } from "@googlemaps/react-wrapper"

import {deepCompareEqualsForMaps,useDeepCompareEffectForMaps,useDeepCompareMemoize} from './Gmap/hooks.js'

export default function Gmap() {
    const render = (status) => {
        return <h1>{status}</h1>
    }
    , [clicks, setClicks] = React.useState([])
    , [zoom, setZoom] = React.useState(3) // initial zoom
    , [center, setCenter] = React.useState({
        lat: 0,
        lng: 0,
    })

    const onClick = (e) => {
        // avoid directly mutating state
        setClicks([...clicks, e.latLng]);
    };
    
    const onIdle = (m) => {
        console.log("onIdle");
        setZoom(m.getZoom());
        setCenter(m.getCenter().toJSON());
    };
    const ref = React.useRef(null)
    const [map, setMap] = React.useState()

    React.useEffect(() => {
    if (ref.current && !map) {
        setMap(new window.google.maps.Map(ref.current, {}))
    }
    }, [ref, map])
    
    return <Wrapper apiKey={"AIzaSyBJcEaaYtL4Y9RmWSDg10UW3dFFpUY6KXc"} render={render}>
        <Map center={center} zoom={zoom}>
            {clicks.map((latLng, i) => (<Marker key={i} position={latLng} />))}
        </Map>
        <section>
            <fieldset>
                <label htmlFor="lat">Latitude</label>
                <input
                    type="number"
                    id="lat"
                    name="lat"
                    value={center.lat}
                    onChange={(event) =>
                        setCenter({ ...center, lat: Number(event.target.value) })
                    }
                />
            </fieldset>
            <fieldset>
                <label htmlFor="lng">Longitude</label>
                <input
                    type="number"
                    id="lng"
                    name="lng"
                    value={center.lng}
                    onChange={(event) =>
                        setCenter({ ...center, lng: Number(event.target.value) })
                    }
                />
            </fieldset>
            <form onSubmit={handleSubmit}>
                <input placeholder="Entrer nom lieu, ou coordonnées de géolocalisation" />
                <button>🔍</button>
            </form>
        </section>
    </Wrapper>
}

const handleSubmit = e => { 
    alert('ok submitted')
}

/*
interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
}
*/
/*
const Map = ({
    onClick,
    onIdle,
    children,
    style,
    ...options
}) => <div ref={ref} style={style} />
*/

const Map = ({
    onClick,
    onIdle,
    children,
    style,
    ...options
}) => {
    const ref = React.useRef(null);
    const [map, setMap] = React.useState()

    React.useEffect(() => {
        if (map) {
            ["click", "idle"].forEach((eventName) =>
                // google.maps.event.clearListeners(map, eventName)
                {}
            );
            if (onClick) {
                map.addListener("click", onClick)
            }
        
            if (onIdle) {
                map.addListener("idle", () => onIdle(map))
            }
        }
    }, [map, onClick, onIdle])

    useDeepCompareEffectForMaps(() => {
        if (map) {
          map.setOptions(options);
        }
      }, [map, options]);

    React.useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}))
        }
    }, [ref, map])

    return <>
        <div id="map" ref={ref}  style={style} />
        {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            // set the map prop on the child component
            // @ts-ignore
            return React.cloneElement(child, { map })
        }
        })}
    </>
}

const Marker = (options) => {
    const [marker, setMarker] = React.useState()

    React.useEffect(() => {
        if (!marker) {
            // setMarker(new google.maps.Marker())
            {}
        }

        // remove marker from map on unmount
        return () => {
            if (marker) {
                marker.setMap(null)
            }
        }
    }, [marker])

    React.useEffect(() => {
        if (marker) {
            marker.setOptions(options)
        }
    }, [marker, options])

    return null
}