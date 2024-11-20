import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";
import "./../assets/scss/index.scss"
import "../styles/cartBestSellers.css"
// import '../styles/globals.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {AuthContextProvider} from '../stores/authContext.js'
import {FormContextProvider} from '../stores/formContext.js'

// import Nav from '../components/Nav'
import ClientIsHome from "./ClientIsHome";
import ClientIsAdmin from "./ClientIsAdmin";
import Footer from "./Footer";
import AfterFooter from "./AfterFooter";

// dans votre fichier _app.js ou un composant spécifique
// import { Agbalumo, Anton, Big_Shoulders_Display, Indie_Flower, Kenia, Shippori_Mincho } from 'next/font/google'

// Définir les configurations pour chaque police
// const agbalumo = Agbalumo({ 
//   subsets: ['latin'], //  ajouter les sous-ensembles nécessaires
//   weight: ['400'] //  spécifier les graisses souhaitées
//   , variable: "--font-agbalumo"
// })
// const anton = Anton({ subsets: ['latin'], weight: ['400'], variable: "--font-anton" })
// const bigShouldersDisplay = Big_Shoulders_Display({ subsets: ['latin'], weight: ['100'], variable: "--font-bigShouldersDisplay" })
// const indieFlower = Indie_Flower({ subsets: ['latin'], weight: ['400'], variable: "--font-indieFlower" })
// const kenia = Kenia({ subsets: ['latin'], weight: ['400'], variable: "--font-kenia" })
// const shipporiMincho = Shippori_Mincho({ subsets: ['latin'], weight: ['400'], variable: "--font-shipporiMincho" })
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})
;

export const metadata = {
  title: "Accueil - Puissance Divine & Sanctuaire Bolobi, Côte d'ivoire",
  description: "Librairie chrétienne à abidjan 2plateaux, et retraite spirituelle à bolobi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="">
      {/*<body className={`${geistSans.variable} ${geistMono.variable}`}>*/}
        
        <AuthContextProvider>
          <FormContextProvider>
            <ClerkProvider>
              <ClientIsHome>
                {children}
              </ClientIsHome>
              <ClientIsAdmin>
                {children}
              </ClientIsAdmin>
              <Footer />
              <AfterFooter />
            </ClerkProvider>
          </FormContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
