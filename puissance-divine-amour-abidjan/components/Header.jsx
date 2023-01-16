// import React from "react";
import Link from "next/link";

import LogSignIn from "./_/LogSignIn.jsx"
import Subscribe from "./_/Subscribe.jsx"
import MenuMain from "./_/MenuMain.jsx"
import Hgroup from "./_/Hgroup.jsx"
import MenuSecondary from "./_/MenuSecondary.jsx"

export default function Header() {

  const getClass = (item, i) => { alert('okk') }
  
  return <header>
      <Hgroup />
      <MenuMain />
      <LogSignIn />
      <Subscribe />
      <MenuSecondary />
      <a
        href="index.php?panier=panier"
        id="paniers"
        title="Accedez au panier ecommerce librairie puissance divine"
      >
        Panier
      </a>
      <aside></aside>
  </header>
}
