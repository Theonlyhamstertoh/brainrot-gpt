import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  try {
    const { pathname, searchParams } = request.nextUrl

    console.log("Middleware triggered for pathname:", pathname)
    console.log("Full URL:", request.url)

    // Handle legacy route redirects first
    if (pathname.match(/^\/(mobile|b4b|search|live|buildops)$/)) {
      const url = new URL("/chat", request.url)

      // Copy all original query parameters to the new URL
      searchParams.forEach((value, key) => {
        url.searchParams.append(key, value)
      })

      // Add a source parameter to indicate where the request came from
      // e.g. /buildops -> ?source=buildops
      // Get the pathname and remove slash, e.g. /buildops, returns buildops
      const source = pathname.replace("/", "")
      url.searchParams.set("source", source)
      return NextResponse.redirect(url)
    }

    // Handle /chat routes - only iframe JWT auth and anonymous access
    if (pathname.startsWith("/chat")) {
      console.log("Chat route detected:", pathname)

      const url = request.nextUrl.clone()
      let modified = false

      // Set source from URL params if available for analytics
      const source = searchParams.get("source")
      const user_id = searchParams.get("user_id")
      const partner_id = searchParams.get("partner_id")
      const supplier_id = searchParams.get("supplier_id")
      const webuser_id = searchParams.get("webuser_id")
      const company_id = searchParams.get("company_id")

      // Add company_id to search params if not already present
      if (company_id && !url.searchParams.has("company_id")) {
        url.searchParams.set("company_id", company_id)
        modified = true
      }

      // Add source to search params if not already present
      if (source && !url.searchParams.has("source")) {
        url.searchParams.set("source", source)
        console.log("setting source >>> ", source)
        modified = true
      }

      // Add type and id based on ID parameters for anonymous user tracking
      if (user_id && !url.searchParams.has("type")) {
        url.searchParams.set("type", "user")
        url.searchParams.set("id", user_id)
        modified = true
      } else if (partner_id && !url.searchParams.has("type")) {
        url.searchParams.set("type", "partner")
        url.searchParams.set("id", partner_id)
        modified = true
      } else if (supplier_id && !url.searchParams.has("type")) {
        url.searchParams.set("type", "supplier")
        url.searchParams.set("id", supplier_id)
        modified = true
      } else if (webuser_id && !url.searchParams.has("type")) {
        url.searchParams.set("type", "web_user")
        url.searchParams.set("id", webuser_id)
        modified = true
      }

      // If we modified the URL, redirect to include the new search params
      if (modified) {
        console.log("Redirecting to URL with search params:", url.toString())
        return NextResponse.redirect(url)
      }

      return NextResponse.next()
    }

    // For all other routes, just continue
    return NextResponse.next()
  } catch (err) {
    console.error("Middleware error:", err)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
