import { isLoaded } from "@clerk/nextjs"
export default function NotConnectedPage() {
  console.log(isLoaded);
  
    return (
      <div>Still loading sorry but you're not yet connected.........</div>
    )
  }
  