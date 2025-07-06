import Image from "next/image"
import React, { useEffect, useState } from "react"

import Link from "next/link"
export function Navbar() {
  return (
    <nav className="flex h-fit w-full flex-col items-end justify-between">
      <div className="flex w-full justify-between px-4 py-3 md:px-6">
        <Link
          className="relative h-full w-16 font-semibold text-blue-600"
          // target="_blank"
          referrerPolicy="no-referrer"
          href="https://bluon.ai/"
        >
          <Image
            src="/assets/bluon.svg"
            fill
            className="object-contain"
            alt="BluonAI Logo"
          />
        </Link>
        <pre className="ml-2 h-fit w-fit rounded-xl bg-blue-500 px-2 py-1 text-xs text-white">
          MasterMechanic v3.0
        </pre>
      </div>
    </nav>
  )
}
