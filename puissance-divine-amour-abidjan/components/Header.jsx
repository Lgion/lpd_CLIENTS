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
      <aside></aside>
  </header>
}
