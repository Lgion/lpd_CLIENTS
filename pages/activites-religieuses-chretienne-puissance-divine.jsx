import {useContext} from 'react'
import Link from "next/link";
import AuthContext from "../stores/authContext.js"
import Head from "next/head"
import Nav from '../components/Nav'

export default function LieuxActivites() {
    const {ok} = useContext(AuthContext)
    , id=3

    return <>
        <Head>
        <title>Create Next Appppp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
        

        <main className="lieux-activites">
            <ul>
                <li>retraites sprituelles</li>
                <li>salle de conférence</li>
            </ul>
        </main>
    </>
}