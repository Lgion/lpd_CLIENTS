import {useState,useEffect,useContext} from 'react'
import Link from "next/link";
import { SignInButton, SignUpButton, UserProfile, UserButton, useAuth, useUser, SignedIn, SignedOut, useClerk } from "@clerk/nextjs"

import AuthContext from "../../stores/authContext.js"

export default function LogSignIn() {

    const [isCartPage, setIsCartPage] = useState()
    , {setIsAdmin} = useContext(AuthContext)
    // , { isLoaded, userId, sessionId, getToken } = useAuth()
    , { isSignedIn, user } = useUser()
    , { signOut } = useClerk();

    useEffect(() => {
        console.log(user?.primaryEmailAddress?.emailAddress)
        if(!isSignedIn)
            setIsAdmin(false)
        if(user?.primaryEmailAddress?.emailAddress == "hi.cyril@gmail.com"
            || true
        )
            setIsAdmin(true)
    }, [user])
    
    
    useEffect(() => { 
        (()=>{setIsCartPage(document.querySelector('#__next>main.cart'))})()
        console.log("TRY TO USE CLERK NPM PACKAGE SOLUTION FOR LOGIN SERVICES")
        // alert("TRY TO USE CLERK NPM PACKAGE SOLUTION FOR LOGIN SERVICES")
    },[])
    
    return <div id="log_and_sign_in" className={isSignedIn ? "connected" : ""}>
        {/* <Link href="sign-in">➕</Link> */}
        {/* <a href="#" onClick={()=>{getClass("inscription","see")}} title="Inscription">
            ➕
        </a> */}


        <SignedOut>
            <SignInButton title="Se conncecter/S'incrire">&nbsp;</SignInButton>
        </SignedOut>
        {/* <SignedOut>
            <SignInButton>➕</SignInButton>
            <SignUpButton>👤</SignUpButton>
        </SignedOut> */}

        <SignedIn>
            <UserButton afterSignOutUrl="/"/>
            {/* <button onClick={() => signOut()} >
            out
            </button> */}
        </SignedIn>
         {/* <UserProfile /> */}


         {/* || 
         - {JSON.stringify(user)}
          - {isLoaded.toString()} - {userId} - {sessionId}
         ||  */}

         {/* <Link href="sign-up">👤</Link> */}
        {/* <a href="#" onClick={()=>{getClass("connexion","see")}} title="Connexion">
            👤
        </a> */}
        <form id="connexion" action="index.php?admin=ok" method="post">
            <input type="text" name="user" placeholder="nom utilisateur" />
            <input type="password" name="pwd" placeholder="**********" />
            <input
            style={{
                padding: 0,
                width: "95%",
                height: "50px",
                cursor: "pointer",
                color: "goldenrod",
                fontSize: "1em",
            }}
            type="submit"
            value="ok"
            />
        </form>
    </div>
}
