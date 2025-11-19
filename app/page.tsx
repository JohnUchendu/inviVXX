// // app/page.tsx

// import LandingPage from '@/components/LandingPage'

// export default function Home() {
//   return <LandingPage />
// }

// app/page.tsx - Updated home page
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import LandingPage from '@/components/LandingPage'
import Dashboard from '@/app/dashboard/page'

export default async function Home() {
  const session = await getServerSession(authOptions)

  // If user is logged in, show dashboard. Otherwise show landing page.
  if (session) {
    return <Dashboard />
  }

  return <LandingPage />
}
