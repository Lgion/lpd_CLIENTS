import {useContext} from 'react'
import AccessDenied from "./AccessDenied"
import AuthContext from "../../stores/authContext"
import "../../assets/scss/admin.scss"
import {AdminContextProvider} from '../../stores/ai_adminContext';

export default function Layout({children}) {
  // const { isAdmin } = useContext(AuthContext)

  
  return (<AdminContextProvider>
    {children}
    {/* {isAdmin && children}
    {!isAdmin && <AccessDenied />} */}
  </AdminContextProvider>)
}
