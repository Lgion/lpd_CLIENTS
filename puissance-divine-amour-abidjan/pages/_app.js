import {AuthContextProvider} from '../stores/authContext.js'
import Layout from '../components/Layout'
import "./../assets/scss/index.scss"
import "../styles/cartBestSellers.css"
// import '../styles/globals.css'


// JAI UTIILISÉ CE REPO POUR LA PAGE PANIER
// https://github.com/Govind783/react-e-commerce-


function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Layout>
          <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  )
}

export default MyApp
