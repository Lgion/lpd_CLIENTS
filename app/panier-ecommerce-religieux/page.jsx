"use client"

import {useState, useEffect, useContext} from 'react'
import AuthContext from "../../stores/authContext.js"
import CartRecap from "../_/Cart/_/CartRecap.jsx"
import CartUserDatasForm from "../_/Cart/_/CartUserDatasForm.jsx"
import CartHold from "../_/Cart/index.js"

export default function Cart() {

  const {userConnectedDatas} = useContext(AuthContext)

  let [cartRecap___, setCartRecap___] = useState()


  useEffect(() => { 
    // setCartRecap___(CartRecap)

  },[])
  
  return <main className="cart">
    {/* {cartRecap___} */}
    <CartRecap />
    {/* {userConnectedDatas 
      ? <div>Email: {userConnectedDatas.email}</div>
      : <CartUserDatasForm />
    } */}
    {/* <CartHold /> */}
  </main>
}
