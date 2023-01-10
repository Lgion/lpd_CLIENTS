// import '../styles/globals.css'
import {AuthContextProvider} from '../stores/authContext.js'
import Layout from '../components/Layout'
import "./../assets/scss/index.scss"

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </Layout>
  )
}

export default MyApp
