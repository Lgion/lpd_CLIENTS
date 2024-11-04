"use client"

import {useContext} from 'react'
import { usePathname } from 'next/navigation'

import AuthContext from "../stores/authContext.js"
import {AdminContextProvider} from '../stores/adminContext.js'
import AccessDenied from "./admin/AccessDenied"
import HeaderAdmin from "./HeaderAdmin"

export default function ClientIsAdmin({children}) {
    
    const pathname = usePathname()
    , {isAdmin} = useContext(AuthContext)

    return <>
        {(isAdmin && pathname?.indexOf('admin') != -1) && <AdminContextProvider>
            <HeaderAdmin />
            {children}
        </AdminContextProvider>}

        {!isAdmin && pathname?.indexOf('admin') != -1 && <AccessDenied />}
    </>
}
