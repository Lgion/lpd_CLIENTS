import {useContext} from 'react'
import AccessDenied from "./AccessDenied"
import AuthContext from "../../stores/authContext"
import "../../assets/scss/admin.scss"

export default function Layout({children}) {
  // const { isAdmin } = useContext(AuthContext)

  
  return (<>
    {children}
    {/* {isAdmin && children}
    {!isAdmin && <AccessDenied />} */}
  </>)
}
