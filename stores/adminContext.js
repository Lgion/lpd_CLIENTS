import {createContext, useEffect, useState, useMemo} from 'react'
// import styled,{createGlobalStyle} from 'styled-components'

const AdminContext = createContext({
    // ok: null,
    // cartBox: null,
    // setCartBox: null,
})
export default AdminContext

export const AdminContextProvider = ({children}) => {


    const [adminMenuActive, setAdminMenuActive] = useState("")
    
    useEffect(() => { 
    }, [])
    const context = {adminMenuActive, setAdminMenuActive}
    
    return (
        <AdminContext.Provider value={context}>
            {children}
        </AdminContext.Provider>
    )
}


