// // middleware.ts

// import { withAuth } from 'next-auth/middleware'
// import { NextResponse } from 'next/server'

// export default withAuth(
//   function middleware(req) {
//     // If user is not authenticated and trying to access protected routes
//     if (!req.nextauth.token) {
//       const url = req.nextUrl.clone()
//       url.pathname = '/'
//       return NextResponse.redirect(url)
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// )

// // Protect all routes except public pages and assets
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api/auth (auth API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public folder
//      * - home page (/) - this will be our public landing
//      * - login page
//      * - register page
//      * - any other public pages you want to add
//      */
//     '/((?!api/auth|_next/static|_next/image|favicon.ico|$|login|register).*)',
//   ],
// }


// middleware.ts

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // If user is not authenticated and trying to access protected routes
    if (!req.nextauth.token) {
      const url = req.nextUrl.clone()
      url.pathname = '/', '/pricing'
      return NextResponse.redirect(url)
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// Protect all routes except public pages, assets, and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/ (all API routes - ADD THIS)
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - home page (/) - this will be our public landing
     * - login page
     * - register page
     * - any other public pages you want to add
     */
    '/((?!api/|_next/static|_next/image|favicon.ico|$|login|register).*)',
  ],
}