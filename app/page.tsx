import { Chat } from "@/components/chat/chat"
import { v4 as uuidv4 } from "uuid"

export const maxDuration = 90

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const id = uuidv4()
  return <Chat key={id} id={id} initialMessages={[]} />
}
