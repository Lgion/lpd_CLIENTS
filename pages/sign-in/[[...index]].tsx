import {useEffect} from 'react'
import { SignIn } from "@clerk/nextjs"
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  useEffect(()=>{
    setTimeout(()=>{
      document.querySelector(".cl-rootBox.cl-signIn-root").addEventListener('click', ()=>{
          router.push('/')
      })
    },2000)
  }, [])
  return <SignIn />;
}