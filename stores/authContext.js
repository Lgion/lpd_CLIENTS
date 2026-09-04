"use client"

import { createContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import mongoose from 'mongoose'
import { mainmenu, settingsSlider, findByIDMainMenu } from '../config/navigation.js'

const AuthContext = createContext({})
export default AuthContext

export const AuthContextProvider = ({ children }) => {
    let router = useRouter()
    let pathname = usePathname()
        , [role, setRole] = useState("")
        , [data, setData] = useState({ categoryPosts: [], diapos: [] })
        , [sommaire, setSommaire] = useState("")
        , renderSommaire = () => {
            let h3s = Array.from(document.querySelectorAll("h3:not(.tagzonePage):not(#blog)"))
                , h4s = document.querySelectorAll("h4")
                , nav = document.querySelector("#__next>header+nav")
                , romains = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "Ⅺ", "Ⅻ"]

            setSommaire(<div id="sommaire">{
                h3s.map((item, i) => <a key={"sanctuaireH3___" + i} href={"#" + item.id}>
                    {console.log(item.dataset)}
                    {item.dataset.icon && <span className={"icon _" + item.dataset.icon}></span>}
                    <span>{item.dataset.sommaire || item.innerText}</span>
                </a>)
            }</div>)
        }
        , cleanModal = () => {
            document.querySelector('#modal .modal___header').innerHTML = ""
            document.querySelector('#modal .modal___footer').innerHTML = ""

            const img = document.querySelector('#modal .modal___main .img')
                , content = document.querySelector('#modal .modal___main .content')
            img && img.remove()
            content && content.remove()
        }
        , myLoader = ({ src, width, quality }) => {
            return `${src}?w=${width}&q=${quality || 75}`
        }
        , [menuActive, setMenuActive] = useState("")
        , [isCartPage, setIsCartPage] = useState(true)
        , [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        (() => { setIsCartPage(document.querySelector('#__next>main.cart')) })()
        renderSommaire()
        router.events?.on('routeChangeStart', (item, i) => {
            console.log("entrain de changer de page")
        })
        router.events?.on('routeChangeComplete', renderSommaire)
    }, [])
    useEffect(() => {
        console.log(menuActive);
        mainmenu.forEach(item => {
            console.log("document.location.href.indexOf(item.href)");
            console.log(document.location.href.indexOf(item.href));
            console.log(document.location.href);
            console.log(item.href);
            console.log(item.id);
            console.log(menuActive);


            if (item.href)
                if (document.location.pathname.indexOf("/posts/") == 0) setMenuActive("blog-bolobi")
                else if (document.location.pathname === item.href && item.id != menuActive) {
                    console.log('oooooooooo');

                    setMenuActive(item.id)
                }
            // else setMenuActive("accueil")
        })
        console.log(menuActive);
        // console.log(findByIDMainMenu(mainmenu, menuActive))
    }, [])
    useEffect(() => {

        console.log(pathname);
        console.log(pathname?.indexOf('admin'));
        console.log(pathname?.indexOf('admin') != -1);
        // alert(Array)
        // console.log(document.querySelectorAll('span.close'))
        document.querySelectorAll('span.close').forEach(elt => {
            elt.addEventListener('click', e => {
                // alert("okkk")
                console.log(e.target.parentElement);
                console.log(document.querySelector('#modal'));
                const doParentIsModal = e.target.parentElement == document.querySelector('#modal')
                if (doParentIsModal && pathname?.indexOf('ecommerce') !== -1)
                    cleanModal()
                e.target.parentElement.classList.remove('active')
            })
        })
        if (document.querySelector('main.sanctuaire_ndr')) {
            const fetchData = async () => {
                try {
                    const postsResponse = await fetch('/api/posts?field=category&value=sanctuaire')
                    const categoryPosts = await postsResponse.json()

                    const diaposResponse = await fetch('/api/diapos?identifiant=home_0')
                    const diapos = await diaposResponse.json()

                    setData({ categoryPosts, diapos })
                } catch (error) {
                    console.error("Erreur lors de la récupération des données:", error)
                }
            }

            fetchData()
        }
    }, [])
    /*
    const [user, setUser] = useState(null)
    const [authReady, setAuthReady] = useState(false)

    useEffect(()=>{
        netlifyIdentity.on('login',(user)=>{
            setUser(user)
            netlifyIdentity.close()
            console.log("login event");
        })
        netlifyIdentity.on('logout',(user)=>{
            setUser(null)
            console.log("logout event");
        })
        netlifyIdentity.on('init', (user)=>{
            setUser(user)
            setAuthReady(true)
            console.log(user);
            console.log('init event');
        })
        //init netlify identity connection
        netlifyIdentity.init()


        return ()=>{
            netlifyIdentity.off('login')
            netlifyIdentity.off('logout')
        }
    }, [])
    
    const login = () => {netlifyIdentity.open()}
    const logout = () => {netlifyIdentity.logout()}
    const context = {user,login,logout,authReady}
    */
    const context = { role, setRole, ok: "okokok", isAdmin, setIsAdmin, isCartPage, mainmenu, menuActive, setMenuActive, findByIDMainMenu, settingsSlider, myLoader, sommaire, setSommaire, renderSommaire, data }

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}
