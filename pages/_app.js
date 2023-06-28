import {AuthContextProvider} from '../stores/authContext.js'
import {FormContextProvider} from '../stores/formContext.js'
import Layout from '../components/Layout'
import "./../assets/scss/index.scss"
import "../styles/cartBestSellers.css"
// import '../styles/globals.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./sanctuaire-rosaire-bolobi-adzope/_/demo.css"
import "./sanctuaire-rosaire-bolobi-adzope/_/magnifier.css"



// JAI UTIILISÉ CE REPO POUR LA PAGE PANIER
// https://github.com/Govind783/react-e-commerce-


function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <FormContextProvider>
        <Layout>
            <Component {...pageProps} />
        </Layout>
      </FormContextProvider>
    </AuthContextProvider>
  )
}

export default MyApp
