import { useAuth } from "@clerk/nextjs"
export default function NotConnectedPage() {
  const { isLoaded } = useAuth();
  console.log(isLoaded);
  
    return (
      <div>Still loading sorry but you're not yet connected.........</div>
    )
  }
  