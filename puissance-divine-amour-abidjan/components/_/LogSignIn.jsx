import React from 'react'

export default function LogSignIn() {
    return <div id="log_and_sign_in">
        <a href="#" onClick={()=>{getClass("inscription","see")}} title="Inscription">
            ➕
        </a> || 
        <a href="#" onClick={()=>{getClass("connexion","see")}} title="Connexion">
            👤
        </a>
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
