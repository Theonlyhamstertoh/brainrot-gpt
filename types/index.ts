// Basic chat types
export type ChatStatus = "streaming" | "submitted" | "error" | "idle"
export type MessageId = string
export type ChatId = string

// Message types
export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt?: Date
}
