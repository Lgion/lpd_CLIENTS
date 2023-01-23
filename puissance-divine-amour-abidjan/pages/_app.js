// import '../styles/globals.css'
import {AuthContextProvider} from '../stores/authContext.js'
import Layout from '../components/Layout'
import "./../assets/scss/index.scss"

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
