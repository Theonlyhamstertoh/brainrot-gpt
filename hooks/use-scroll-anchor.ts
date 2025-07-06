"use client"
import { useCallback, useEffect, useRef, useState } from "react"

export const useScrollAnchor = () => {
  const messagesRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const observerRef = useRef<MutationObserver | null>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  const checkIfAtBottom = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const atBottom = scrollHeight - scrollTop - clientHeight < 1
      setIsAtBottom(atBottom)
      setShouldAutoScroll(atBottom)
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkIfAtBottom)
      checkIfAtBottom()

      return () => {
        scrollElement.removeEventListener("scroll", checkIfAtBottom)
      }
    }
  }, [])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (shouldAutoScroll && messagesRef.current) {
      observerRef.current = new MutationObserver(() => {
        scrollToBottom()
      })

      observerRef.current.observe(messagesRef.current, {
        childList: true,
        subtree: true,
      })
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [shouldAutoScroll, scrollToBottom])

  const disableAutoScroll = () => {
    setShouldAutoScroll(false)
  }

  const enableAutoScroll = () => {
    setShouldAutoScroll(true)
    scrollToBottom()
  }

  return {
    messagesRef,
    scrollRef,
    isAtBottom,
    scrollToBottom,
    disableAutoScroll,
    enableAutoScroll,
  }
}
