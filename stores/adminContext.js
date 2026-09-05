"use client"

import { createContext, useState } from 'react'

const AdminContext = createContext({
    adminMenuActive: "",
    setAdminMenuActive: () => {}
})

export default AdminContext

export const AdminContextProvider = ({ children }) => {
    const [adminMenuActive, setAdminMenuActive] = useState("")

    const context = {
        adminMenuActive,
        setAdminMenuActive
    }

    return (
        <AdminContext.Provider value={context}>
            {children}
        </AdminContext.Provider>
    )
}
