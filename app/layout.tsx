import { Metadata } from "next"
import "./globals.css"

import { Analytics } from "@vercel/analytics/react"
import clsx from "clsx"
import { Toaster } from "react-hot-toast"
import { bungee, dm_sans, domine, inter, roboto } from "./fonts"
import { Suspense } from "react"

import { generateId } from "ai"
import { TooltipProvider } from "@/components/ui/tooltip"

if (!process.env.SITE_URL) {
  throw new Error("Missing Environment Variable SITE_URL")
}

export const metadata: Metadata = {
  title: "Bluon AI MasterMechanic - HVAC AI",
  metadataBase: new URL(process.env.SITE_URL!),
  description:
    "Bluon's AI MasterMechanic is a breakthrough artificial intelligence system for the HVAC industry. It's designed to help HVAC service technicians diagnose and solve most problems in the field, using only natural language inputs. ",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: ["/assets/og.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          "antialiased",
          // roboto.className,
          bungee.variable,
          inter.variable,
          dm_sans.className,
          domine.variable
        )}
      >
        <div className="flex h-dvh flex-col justify-between">
          <Toaster
            toastOptions={{
              duration: 1000,
              className: "shadow-none border border-gray-200",
              style: {
                boxShadow: "none",
              },
            }}
          />
          <TooltipProvider>
            <Suspense>{children}</Suspense>
          </TooltipProvider>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
