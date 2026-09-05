import "../../assets/scss/admin.scss"
import { AdminContextProvider } from "../../stores/adminContext"

export default function Layout({children}) {
  return (
    <AdminContextProvider>
      {children}
    </AdminContextProvider>
  )
}
