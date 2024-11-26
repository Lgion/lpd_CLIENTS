import {useState, useContext, useEffect} from 'react'
import Link from "next/link";
import AuthContext from "../../stores/authContext.js"

export default function MenuMain() {

    const {isAdmin, cartBox, isCartPage, mainmenu, menuActive, setMenuActive} = useContext(AuthContext)
    
    
    return <>
        <menu className="mainMenu">
            {/* {isAdmin && <menu className="admin">
                <li><Link href="/admin/school">ÉCOLE</Link></li>   
            </menu>} */}
            {
                mainmenu.map((item,i) => item.id!="accueil" && <li className={"menu "+item.id} key={"m1st___"+i}>
                    {/* {console.log(item)} */}
                    <Link
                        href={item.href}
                        title={item.title}
                        id={item.id+"_menu"}
                        className={menuActive==item.id?"active":""}
                        onClick={()=>{
                            setMenuActive(item.id)
                            // setMainMenuObject(item.h2)
                        }}
                    >
                        <span>
                            {item.content}
                        </span>
                    </Link>
                </li>
                )
            }
        </menu>
    </>
}
