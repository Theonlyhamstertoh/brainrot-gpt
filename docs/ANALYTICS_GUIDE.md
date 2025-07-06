# Bluon AI Analytics - Feature Tracking Guide

This guide explains how to use the analytics tracking system for the Bluon AI HVAC application using Vercel Analytics.

## Overview

The analytics system tracks key feature usage across your application:

- **Chat interactions** - Different message types and input methods
- **User feedback** - Response interactions and ratings
- **UI interactions** - Navigation and settings changes

## Setup

Import and use the analytics functions in your components:

```tsx
import { analytics } from "@/lib/analytics"

// Track different message types
analytics.messageSent("user_input") // User typed message
analytics.messageSent("decision_tree") // Decision tree flow

// Track UI interactions
analytics.responseStyleChanged("detailed")

// Track user feedback
analytics.sentFeedback("upvote")
```

## Available Analytics Events

### Chat Message Types

```tsx
// Different ways users send messages
analytics.messageSent(type)
```

**Message Types:**

- `"user_input"` - User typed directly in chat
- `"customer_job_summary"` - Customer job summary tool
- `"technical_job_summary"` - Technical job summary tool
- `"model_uuid_searched"` - Model search via UUID
- `"search_parameter"` - Message from URL search parameter
- `"decision_tree"` - Decision tree troubleshooting flow

### Chat Management

```tsx
// Chat lifecycle
analytics.chatCreated() // New chat started
analytics.pastChatOpened() // Existing chat reopened
```

### User Feedback

```tsx
// Response feedback
analytics.copiedResponse() // User copied AI response
analytics.playedAudioResponse() // User played audio response
analytics.sentFeedback("upvote" | "downvote") // User rated response
```

### UI Interactions

```tsx
// Settings and preferences
analytics.responseStyleChanged("detailed" | "conversational")
```

## Implementation Examples

### Chat Input Component

```tsx
import { analytics } from "@/lib/analytics"

const handleSubmit = (message: string) => {
  // Track regular user input
  analytics.messageSent("user_input")

  // Submit message...
}

const handleDecisionTree = () => {
  // Track decision tree usage
  analytics.messageSent("decision_tree")

  // Process decision tree...
}
```

### Job Summary Tools

```tsx
const handleJobSummary = (type: "customer" | "technical") => {
  // Track specific job summary type
  analytics.messageSent(`${type}_job_summary`)

  // Create job summary...
}
```

### Response Interactions

```tsx
const handleCopyResponse = () => {
  analytics.copiedResponse()
  // Copy logic...
}

const handleFeedback = (type: "upvote" | "downvote") => {
  analytics.sentFeedback(type)
  // Submit feedback...
}
```

## Analytics Dashboard Events

You'll see these events in your Vercel Analytics:

### Message Events

- `chat_message_sent` - with type property showing input method
- `chat_created` - new chat sessions
- `past_chat_opened` - returning to existing chats

### Feedback Events

- `copied_response` - response copying
- `played_audio_response` - audio playback
- `sent_feedback` - user ratings (upvote/downvote)

### UI Events

- `response_style_changed` - style preference changes

## Key Insights

This tracking helps you understand:

1. **Input Preferences**: Text vs tools usage patterns
2. **Feature Adoption**: Which AI tools and flows are most popular
3. **User Engagement**: How users interact with responses (copy, audio, feedback)
4. **Chat Patterns**: New vs returning chat behavior

## Message Type Breakdown

- **user_input**: Direct typing (most common)
- **decision_tree**: Guided troubleshooting
- **customer_job_summary**: Customer-facing summaries
- **technical_job_summary**: Technical documentation
- **model_uuid_searched**: Equipment model lookups
- **search_parameter**: URL-based searches

Simple, focused analytics for understanding how users interact with your HVAC AI assistant!
