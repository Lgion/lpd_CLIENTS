"use client"

import React, { useState, useContext, useEffect, memo, useCallback, useMemo } from "react";
import Image from "next/image"
import Slider from "react-slick";
import AuthContext from "../../stores/authContext.js"
import EditMongoForm from '../admin/school/EditMongoForm'
import { createPortal } from "react-dom"



//carousel simple: https://react-slick.neostack.com/
//carousel npm: https://www.npmjs.com/package/react-responsive-carousel
// 40 carousels comp: https://reactjsexample.com/tag/carousel/
// 14 carousels comp: https://alvarotrigo.com/blog/react-carousels/
// carousel comp: https://coreui.io/react/docs/components/carousel/
// carousel: https://www.gaji.jp/blog/2022/10/28/11858/
// spinner,bugger,carousel,countup,markdown: https://qiita.com/baby-degu/items/e183b20dd20b20920e00



const Carousel = memo(function Carousel({ page = "home", diapos: initialDiapos, titre, icon = 1, sommaire, h3id = "anchorCarousel" }) {
    const [h3, setH3] = useState("TROUVER UN TITRE")
    const [diapos, setDiapos] = useState(initialDiapos || [])
    const [modalState, setModalState] = useState({ isOpen: false, item: null })
    const { settingsSlider, isAdmin } = useContext(AuthContext)
        , [models, setModels] = useState({})

    const myLoader = useCallback(({ src, width, quality }) => {
        return `${src}?w=${width}&q=${quality || 75}`
    }, [])

    const handleUpdate = useCallback((e, item) => {
        setModalState({ isOpen: true, item: item })
    }, [])

    const handleDelete = useCallback((e) => {
        const doSupp = confirm("Êtes-vous sûr de vouloir supprimer cette photo du diapo ?")
        if (doSupp) {
            fetch(`/api/diapo?_id=${e.target.dataset._id}&src=${e.target.dataset.src}`, {
                method: "DELETE"
            })
        }
    }, [])

    const fetchDiapos = useCallback(async () => {
        const storedDiapos = localStorage.getItem('carouselDiapos')
        const timeStamp = localStorage.getItem('carouselDiaposTimeStamp')
        const now = +new Date()
        const shouldFetch = (((now - timeStamp) / 1000) / 3600) > 24

        if (storedDiapos && !shouldFetch) {
            try {
                let parsedDiapos = JSON.parse(storedDiapos)
                parsedDiapos = parsedDiapos.filter(item => item['identifiant_$_hidden'] == page + "_0")
                if (Array.isArray(parsedDiapos) && parsedDiapos.length > 0) {
                    setDiapos(parsedDiapos)
                    return
                }
            } catch (error) {
                console.error('Erreur lors de la lecture du localStorage pour les diapos:', error)
            }
        }

        try {
            const response = await fetch('/api/diapos?identifiant=' + page + '_0')
            // const response = await fetch('/api/diapos')
            const data = await response.json()
            if (Array.isArray(data) && data.length > 0) {
                const timeStamp = +new Date()
                localStorage.setItem('carouselDiaposTimeStamp', timeStamp)
                localStorage.setItem('carouselDiapos', JSON.stringify(data))
                const currentData = data.filter(item => item['identifiant_$_hidden'] == page + "_0")
                setDiapos(currentData)
            } else {
                console.error('Les données de diapos reçues ne sont pas un tableau valide')
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des diapos:', error)
        }
    }, [])


    useEffect(() => {

        let ok = async () => {
            const ok = await fetch("/api/diapo")
                , data = await ok.json()
            console.log(data);
            setModels(data)
            console.log(data);

        }
        ok()
    }, [])
    useEffect(() => {
        setH3(titre)
        fetchDiapos()
    }, [titre, fetchDiapos])

    const memoizedDiapos = useMemo(() => diapos, [diapos])
    const reloadBtn = () => {
        localStorage.clear()
        location.reload()
    }

    return (
        <>
            <h3 className="carousel" id={h3id} data-icon={icon} data-sommaire={sommaire || titre}>{h3}</h3>
            <section className="carousel">
                {isAdmin && (<>
                    <div id="admin_carousel">
                        <button title="Recharger les données du carousel" style={{ left: "2em" }} onClick={reloadBtn}>⟳</button>
                        <button
                            title="Ajouter une slide à votre diapo"
                            onClick={() => setModalState({ isOpen: true, item: null })}
                        >
                            +
                        </button>
                    </div>
                    {modalState.isOpen && createPortal(
                        <div className="c-modal">
                            <div className="c-modal__main">
                                <div className="c-modal__header">
                                    <figcaption>
                                        <strong>{modalState.item ? "Modifier la diapositive" : "Ajouter une nouvelle diapositive"} ({page})</strong>
                                        <span className="close" onClick={() => setModalState({ isOpen: false, item: null })}></span>
                                    </figcaption>
                                </div>
                                <EditMongoForm
                                    hiddens={{ identifiant: page + "_0" }}
                                    endpoint="diapo"
                                    modelKey="slider"
                                    model={models?.schemaDiapo?.paths || {}}
                                    datas={modalState.item}
                                />
                                <div className="c-modal__footer">
                                    <button type="button" className="cancel safe" style={{ padding: '8px 16px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setModalState({ isOpen: false, item: null })}>Fermer</button>
                                </div>
                            </div>
                        </div>
                        , document.body
                    )}
                </>
                )}
                <Slider {...settingsSlider}>
                    {memoizedDiapos.map((item, i) => item['identifiant_$_hidden'].indexOf(page) !== -1 && (
                        <figure key={`carousel${i}`}>
                            {isAdmin && (
                                <ul className="admin">
                                    <li onClick={(e) => handleUpdate(e, item)}>✎</li>
                                    <li onClick={handleDelete} data-_id={item._id} data-src={item.src_$_file}>🗑️</li>
                                </ul>
                            )}
                            <Image
                                loader={myLoader}
                                src={item.src_$_file.replace("images/", "images/" + (() => {
                                    try {
                                        const m = typeof item.metas === 'string' ? JSON.parse(item.metas) : (item.metas || {});
                                        return m.path ? m.path + "/" : "";
                                    } catch (e) { return ""; }
                                })())}
                                alt={item.alt}
                                title={item.title}
                                width={200}
                                height={200}
                            />
                            <ul></ul>
                            <figcaption>
                                <h4>{item.title}</h4>
                                {/* <p>{item.figcaption}</p> */}
                            </figcaption>
                        </figure>
                    ))}
                </Slider>
            </section>
        </>
    )
})

export default Carousel
