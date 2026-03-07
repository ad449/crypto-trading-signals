import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to the vanilla frontend
  redirect('/index.html')
}
