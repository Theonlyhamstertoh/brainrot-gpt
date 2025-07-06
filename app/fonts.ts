import {
  Bungee,
  Roboto,
  DM_Sans,
  Domine,
  Inter,
  Bakbak_One,
} from "next/font/google"

export const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
})
export const dm_sans = DM_Sans({
  weight: ["300", "400", "500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
})
export const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-inter",
})

export const bungee = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bungee",
})
export const bakbak_one = Bakbak_One({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bakbak",
})
export const domine = Domine({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-domine",
})
