import {useState, useEffect, useContext} from 'react'
import AuthContext from "../stores/authContext.js"
import CartRecap from "../components/_/Cart/_/CartRecap"
import CartUserDatasForm from "../components/_/Cart/_/CartUserDatasForm"
import CartHold from "../components/_/Cart"

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
