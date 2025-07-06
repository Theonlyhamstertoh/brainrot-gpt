# Bluon AI Authentication Setup Guide

Complete implementation guide for integrating Bluon AI's JWT-based authentication system with your application.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Step-by-Step Implementation](#step-by-step-implementation)
- [Advanced Configuration](#advanced-configuration)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

## Overview

Bluon AI uses a secure JWT-based authentication system designed for iframe integration with cross-origin communication via postMessage. This approach ensures:

- **Secure**: JWT tokens with configurable expiration
- **Cross-Origin**: CORS-compliant iframe embedding
- **Flexible**: Support for anonymous and authenticated users
- **Scalable**: Handles multiple user types (users, companies, partners, suppliers)

### Supported User Types

| User Type       | ID Field     | Use Case                      |
| --------------- | ------------ | ----------------------------- |
| Individual User | `id`         | Personal accounts             |
| Company         | `companyId`  | Organization accounts         |
| Partner         | `partnerId`  | Business partner integrations |
| Supplier        | `supplierId` | Supplier portal access        |
| Web User        | `webuserId`  | Website visitor tracking      |

## Quick Start

### 1. Basic HTML Integration

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App with Bluon AI</title>
  </head>
  <body>
    <h1>Welcome to My Application</h1>

    <!-- Bluon AI Chatbot Container -->
    <div id="chatbot-container">
      <iframe
        id="bluon-chatbot"
        src="https://www.bluon.ai/chat?auth=postmessage"
        width="100%"
        height="600"
        style="border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
        allow="microphone; camera"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
      >
      </iframe>
      <div id="chatbot-status">Initializing...</div>
    </div>

    <script>
      const BLUON_CONFIG = {
        baseUrl: "https://www.bluon.ai",
        userId: "user_12345", // Your user identifier
        companyId: "company_abc", // Optional: organization ID
        debug: true, // Set to false in production
      }

      class BluonChatbot {
        constructor(config) {
          this.config = config
          this.iframe = document.getElementById("bluon-chatbot")
          this.statusEl = document.getElementById("chatbot-status")
          this.isReady = false
          this.init()
        }

        async init() {
          try {
            this.updateStatus("Generating authentication token...")
            const token = await this.generateToken()

            this.updateStatus("Loading chatbot...")
            await this.waitForIframe()

            this.updateStatus("Authenticating...")
            await this.authenticate(token)

            this.updateStatus("Ready")
            this.isReady = true
          } catch (error) {
            this.updateStatus(`Error: ${error.message}`)
            console.error("Bluon AI initialization failed:", error)
          }
        }

        async generateToken() {
          const payload = { id: this.config.userId }
          if (this.config.companyId) payload.companyId = this.config.companyId

          const response = await fetch(
            `${this.config.baseUrl}/api/v1/generate-chatbot-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          )

          if (!response.ok) {
            throw new Error(`Token generation failed: ${response.status}`)
          }

          const { token } = await response.json()
          return token
        }

        waitForIframe() {
          return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Iframe load timeout"))
            }, 10000)

            const checkReady = () => {
              if (this.iframe.contentWindow) {
                clearTimeout(timeout)
                resolve()
              } else {
                setTimeout(checkReady, 100)
              }
            }

            if (this.iframe.contentWindow) {
              clearTimeout(timeout)
              resolve()
            } else {
              this.iframe.onload = () => {
                clearTimeout(timeout)
                resolve()
              }
            }
          })
        }

        authenticate(token) {
          return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Authentication timeout"))
            }, 5000)

            const handleMessage = (event) => {
              if (event.origin !== this.config.baseUrl) return

              if (event.data?.type === "chatbot-ready") {
                clearTimeout(timeout)
                window.removeEventListener("message", handleMessage)
                resolve()
              } else if (event.data?.type === "chatbot-error") {
                clearTimeout(timeout)
                window.removeEventListener("message", handleMessage)
                reject(
                  new Error(
                    event.data.payload?.message || "Authentication failed"
                  )
                )
              }
            }

            window.addEventListener("message", handleMessage)

            // Send authentication token
            this.iframe.contentWindow.postMessage(
              {
                type: "auth",
                token: token,
                timestamp: Date.now(),
              },
              this.config.baseUrl
            )
          })
        }

        updateStatus(message) {
          this.statusEl.textContent = message
          if (this.config.debug) {
            console.log(`[Bluon AI] ${message}`)
          }
        }
      }

      // Initialize when DOM is ready
      document.addEventListener("DOMContentLoaded", () => {
        new BluonChatbot(BLUON_CONFIG)
      })
    </script>
  </body>
</html>
```

### 2. React Integration

```tsx
// components/BluonChatbot.tsx
import React, { useEffect, useRef, useState, useCallback } from "react"

interface BluonChatbotProps {
  userId: string
  companyId?: string
  partnerId?: string
  supplierId?: string
  webuserId?: string
  className?: string
  onReady?: () => void
  onError?: (error: Error) => void
}

export const BluonChatbot: React.FC<BluonChatbotProps> = ({
  userId,
  companyId,
  partnerId,
  supplierId,
  webuserId,
  className = "",
  onReady,
  onError,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const generateToken = useCallback(async () => {
    const payload: any = { id: userId }
    if (companyId) payload.companyId = companyId
    if (partnerId) payload.partnerId = partnerId
    if (supplierId) payload.supplierId = supplierId
    if (webuserId) payload.webuserId = webuserId

    const response = await fetch(
      "https://www.bluon.ai/api/v1/generate-chatbot-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      throw new Error(
        `Token generation failed: ${response.status} ${response.statusText}`
      )
    }

    const { token } = await response.json()
    return token
  }, [userId, companyId, partnerId, supplierId, webuserId])

  const handlePostMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== "https://www.bluon.ai") return

      switch (event.data?.type) {
        case "chatbot-ready":
          setStatus("ready")
          onReady?.()
          break
        case "chatbot-error":
          const error = new Error(
            event.data.payload?.message || "Chatbot error"
          )
          setStatus("error")
          setErrorMessage(error.message)
          onError?.(error)
          break
      }
    },
    [onReady, onError]
  )

  const authenticate = useCallback(async () => {
    if (!iframeRef.current?.contentWindow) return

    try {
      const token = await generateToken()

      iframeRef.current.contentWindow.postMessage(
        {
          type: "auth",
          token,
          timestamp: Date.now(),
        },
        "https://www.bluon.ai"
      )
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Authentication failed")
      setStatus("error")
      setErrorMessage(err.message)
      onError?.(err)
    }
  }, [generateToken, onError])

  useEffect(() => {
    window.addEventListener("message", handlePostMessage)
    return () => window.removeEventListener("message", handlePostMessage)
  }, [handlePostMessage])

  const handleIframeLoad = useCallback(() => {
    // Small delay to ensure iframe is fully loaded
    setTimeout(authenticate, 100)
  }, [authenticate])

  return (
    <div className={`bluon-chatbot-container ${className}`}>
      <iframe
        ref={iframeRef}
        src="https://www.bluon.ai/chat?auth=postmessage"
        width="100%"
        height="600"
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
        allow="microphone; camera"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        onLoad={handleIframeLoad}
      />

      {status === "loading" && (
        <div className="chatbot-status loading">Initializing Bluon AI...</div>
      )}

      {status === "error" && (
        <div className="chatbot-status error">Error: {errorMessage}</div>
      )}
    </div>
  )
}

// Usage example
export default function MyApp() {
  const handleChatbotReady = () => {
    console.log("Bluon AI is ready!")
  }

  const handleChatbotError = (error: Error) => {
    console.error("Bluon AI error:", error)
  }

  return (
    <div>
      <h1>My Application</h1>
      <BluonChatbot
        userId="user_12345"
        companyId="company_abc"
        onReady={handleChatbotReady}
        onError={handleChatbotError}
        className="my-chatbot"
      />
    </div>
  )
}
```

## Architecture

### Authentication Flow Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Your App      │    │   Bluon AI API   │    │ Bluon AI Client │
│                 │    │                  │    │    (iframe)     │
└─────┬───────────┘    └────────┬─────────┘    └─────┬───────────┘
      │                         │                    │
      │ 1. Generate Token       │                    │
      ├────────────────────────►│                    │
      │                         │                    │
      │ 2. Return JWT           │                    │
      │◄────────────────────────┤                    │
      │                         │                    │
      │ 3. Load iframe          │                    │
      │                         │                    │
      │ 4. postMessage(token)   │                    │
      ├─────────────────────────┼───────────────────►│
      │                         │                    │
      │                         │ 5. Validate JWT    │
      │                         │◄───────────────────┤
      │                         │                    │
      │                         │ 6. Set session     │
      │                         │                    │
      │ 7. Ready confirmation   │                    │
      │◄────────────────────────┼────────────────────┤
      │                         │                    │
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "iss": "bluon-ai",
    "aud": "bluon-ai-iframe",
    "sub": "user_12345",
    "iat": 1640995200,
    "exp": 1640998800,
    "companyId": "company_abc",
    "partnerId": "partner_xyz",
    "supplierId": "supplier_123",
    "webuserId": "webuser_456"
  }
}
```

## Step-by-Step Implementation

### Step 1: Set Up CORS Configuration

Ensure your domain is whitelisted in Bluon AI's CORS configuration:

**Contact Bluon AI Support** to add your domain to the allowed origins list, or if you're self-hosting, update your environment variables:

```bash
# .env.local
ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com,http://localhost:3000
```

### Step 2: Generate JWT Token

**Backend Implementation** (Node.js/Express example):

```javascript
// routes/auth.js
const express = require("express")
const fetch = require("node-fetch")
const router = express.Router()

router.post("/generate-bluon-token", async (req, res) => {
  try {
    const { userId, companyId } = req.body

    // Your authentication logic here
    if (!userId) {
      return res.status(400).json({ error: "User ID required" })
    }

    const payload = { id: userId }
    if (companyId) payload.companyId = companyId

    const response = await fetch(
      "https://www.bluon.ai/api/v1/generate-chatbot-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      throw new Error(`Bluon AI API error: ${response.status}`)
    }

    const { token } = await response.json()
    res.json({ token })
  } catch (error) {
    console.error("Token generation error:", error)
    res.status(500).json({ error: "Failed to generate token" })
  }
})

module.exports = router
```

**Frontend Token Request**:

```javascript
async function getBluonToken(userId, companyId) {
  const response = await fetch("/api/generate-bluon-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, companyId }),
  })

  if (!response.ok) {
    throw new Error("Failed to get Bluon token")
  }

  const { token } = await response.json()
  return token
}
```

### Step 3: Iframe Integration with Error Handling

```html
<div id="bluon-container">
  <iframe
    id="bluon-iframe"
    src="https://www.bluon.ai/chat?auth=postmessage"
    style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 8px;"
  >
  </iframe>
  <div id="bluon-status" style="text-align: center; padding: 10px;">
    Loading...
  </div>
</div>

<script>
  class BluonAuth {
    constructor() {
      this.iframe = document.getElementById("bluon-iframe")
      this.status = document.getElementById("bluon-status")
      this.maxRetries = 3
      this.retryCount = 0
      this.init()
    }

    async init() {
      try {
        await this.authenticate()
      } catch (error) {
        this.handleError(error)
      }
    }

    async authenticate() {
      this.updateStatus("Generating authentication token...")

      const token = await this.getToken()

      this.updateStatus("Authenticating with Bluon AI...")

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Authentication timeout"))
        }, 10000)

        const messageHandler = (event) => {
          if (event.origin !== "https://www.bluon.ai") return

          switch (event.data?.type) {
            case "chatbot-ready":
              clearTimeout(timeout)
              window.removeEventListener("message", messageHandler)
              this.updateStatus("Ready", "success")
              resolve()
              break

            case "chatbot-error":
              clearTimeout(timeout)
              window.removeEventListener("message", messageHandler)
              reject(
                new Error(
                  event.data.payload?.message || "Authentication failed"
                )
              )
              break
          }
        }

        window.addEventListener("message", messageHandler)

        // Wait for iframe to load, then send token
        const sendToken = () => {
          this.iframe.contentWindow.postMessage(
            {
              type: "auth",
              token: token,
              timestamp: Date.now(),
            },
            "https://www.bluon.ai"
          )
        }

        if (this.iframe.contentWindow) {
          sendToken()
        } else {
          this.iframe.onload = sendToken
        }
      })
    }

    async getToken() {
      const userId = "your-user-id" // Get from your auth system
      const companyId = "your-company-id" // Optional

      const response = await fetch("/api/generate-bluon-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, companyId }),
      })

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`)
      }

      const { token } = await response.json()
      return token
    }

    handleError(error) {
      console.error("Bluon AI Error:", error)

      if (this.retryCount < this.maxRetries) {
        this.retryCount++
        this.updateStatus(
          `Error occurred. Retrying... (${this.retryCount}/${this.maxRetries})`,
          "warning"
        )
        setTimeout(() => this.init(), 2000)
      } else {
        this.updateStatus(`Failed to load Bluon AI: ${error.message}`, "error")
      }
    }

    updateStatus(message, type = "info") {
      this.status.textContent = message
      this.status.className = `status ${type}`
    }
  }

  // Initialize when page loads
  document.addEventListener("DOMContentLoaded", () => {
    new BluonAuth()
  })
</script>

<style>
  .status {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
  }
  .status.info {
    background: #e3f2fd;
    color: #1565c0;
  }
  .status.success {
    background: #e8f5e8;
    color: #2e7d32;
  }
  .status.warning {
    background: #fff3e0;
    color: #f57c00;
  }
  .status.error {
    background: #ffebee;
    color: #c62828;
  }
</style>
```

## Advanced Configuration

### Multi-User Type Support

```javascript
// Advanced token generation for different user types
async function generateAdvancedToken({
  userId, // Required: Primary user identifier
  companyId, // Optional: Company/organization ID
  partnerId, // Optional: Business partner ID
  supplierId, // Optional: Supplier ID
  webuserId, // Optional: Anonymous web user tracking
  customClaims = {}, // Optional: Additional custom claims
}) {
  const payload = {
    id: userId,
    ...customClaims,
  }

  // Add optional IDs
  if (companyId) payload.companyId = companyId
  if (partnerId) payload.partnerId = partnerId
  if (supplierId) payload.supplierId = supplierId
  if (webuserId) payload.webuserId = webuserId

  const response = await fetch(
    "https://www.bluon.ai/api/v1/generate-chatbot-token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error(`Token generation failed: ${response.status}`)
  }

  return await response.json()
}

// Usage examples:
// Individual user
const userToken = await generateAdvancedToken({ userId: "user123" })

// Company user
const companyToken = await generateAdvancedToken({
  userId: "user123",
  companyId: "company456",
})

// Partner integration
const partnerToken = await generateAdvancedToken({
  userId: "partner_admin",
  partnerId: "partner789",
  customClaims: { role: "admin", permissions: ["read", "write"] },
})
```

### Environment-Specific Configuration

```javascript
// config/bluon.js
const BLUON_CONFIG = {
  development: {
    baseUrl: "http://localhost:3000",
    debug: true,
    timeout: 10000,
  },
  staging: {
    baseUrl: "https://staging.bluon.ai",
    debug: true,
    timeout: 8000,
  },
  production: {
    baseUrl: "https://www.bluon.ai",
    debug: false,
    timeout: 5000,
  },
}

export const getBluonConfig = () => {
  const env = process.env.NODE_ENV || "development"
  return BLUON_CONFIG[env]
}
```

### Custom Event Handling

```javascript
class AdvancedBluonIntegration {
  constructor(config) {
    this.config = config
    this.eventHandlers = new Map()
    this.init()
  }

  // Event system for custom integration needs
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event).push(handler)
  }

  emit(event, data) {
    const handlers = this.eventHandlers.get(event) || []
    handlers.forEach((handler) => handler(data))
  }

  async init() {
    this.setupMessageHandling()
    await this.authenticate()
  }

  setupMessageHandling() {
    window.addEventListener("message", (event) => {
      if (event.origin !== this.config.baseUrl) return

      const { type, payload } = event.data

      switch (type) {
        case "chatbot-ready":
          this.emit("ready", payload)
          break
        case "chatbot-error":
          this.emit("error", payload)
          break
        case "chat-message-sent":
          this.emit("messageSent", payload)
          break
        case "chat-response-received":
          this.emit("responseReceived", payload)
          break
        default:
          this.emit("unknown", { type, payload })
      }
    })
  }
}

// Usage
const bluon = new AdvancedBluonIntegration(getBluonConfig())

bluon.on("ready", () => {
  console.log("Bluon AI is ready!")
  // Track analytics
  analytics.track("bluon_ai_loaded")
})

bluon.on("messageSent", (data) => {
  console.log("User sent message:", data)
  // Track user engagement
  analytics.track("bluon_message_sent", data)
})

bluon.on("error", (error) => {
  console.error("Bluon AI error:", error)
  // Error reporting
  errorReporting.report("bluon_ai_error", error)
})
```

## Security Best Practices

### 1. Token Security

- **Never expose JWT secrets** in client-side code
- **Use HTTPS** for all communications
- **Implement token expiration** (1 hour recommended)
- **Validate tokens server-side** before generation

### 2. CORS Configuration

```javascript
// Proper CORS setup for production
const allowedOrigins = [
  "https://yourapp.com",
  "https://www.yourapp.com",
  // Add all your legitimate domains
]

// Never use wildcard (*) in production
// ❌ Don't do this in production:
// res.header('Access-Control-Allow-Origin', '*');

// ✅ Do this instead:
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin)
  }
  next()
})
```

### 3. iframe Security

```html
<!-- Secure iframe attributes -->
<iframe
  src="https://www.bluon.ai/chat?auth=postmessage"
  sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
  allow="microphone; camera"
  referrerpolicy="strict-origin-when-cross-origin"
>
</iframe>
```

### 4. Input Validation

```javascript
// Validate all inputs before token generation
function validateTokenRequest({ userId, companyId, partnerId, supplierId }) {
  const errors = []

  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    errors.push("User ID is required and must be a non-empty string")
  }

  if (userId && userId.length > 100) {
    errors.push("User ID must be less than 100 characters")
  }

  if (companyId && typeof companyId !== "string") {
    errors.push("Company ID must be a string")
  }

  // Add validation for other optional fields...

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(", ")}`)
  }
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Unauthorized origin" Error

**Problem**: CORS error when making token requests

**Solution**:

```bash
# Check if your domain is in the allowed origins
# Contact Bluon AI support to whitelist your domain
# For development, ensure localhost is included
```

#### 2. Authentication Timeout

**Problem**: postMessage authentication never completes

**Solution**:

```javascript
// Add debugging to identify the issue
const DEBUG = true

function authenticateWithDebugging(token) {
  return new Promise((resolve, reject) => {
    let attempts = 0
    const maxAttempts = 3

    const attemptAuth = () => {
      attempts++
      if (DEBUG) console.log(`Auth attempt ${attempts}/${maxAttempts}`)

      const timeout = setTimeout(() => {
        if (attempts < maxAttempts) {
          if (DEBUG) console.log("Retrying authentication...")
          attemptAuth()
        } else {
          reject(new Error("Authentication timeout after multiple attempts"))
        }
      }, 5000)

      const messageHandler = (event) => {
        if (event.origin !== "https://www.bluon.ai") {
          if (DEBUG) console.log("Ignoring message from:", event.origin)
          return
        }

        if (DEBUG) console.log("Received message:", event.data)

        if (event.data?.type === "chatbot-ready") {
          clearTimeout(timeout)
          window.removeEventListener("message", messageHandler)
          resolve()
        }
      }

      window.addEventListener("message", messageHandler)

      // Send auth message
      iframe.contentWindow.postMessage(
        {
          type: "auth",
          token: token,
          timestamp: Date.now(),
        },
        "https://www.bluon.ai"
      )
    }

    attemptAuth()
  })
}
```

#### 3. Token Generation Fails

**Problem**: 400/403 errors when generating tokens

**Solution**:

```javascript
// Add detailed error logging
async function generateTokenWithErrorHandling(payload) {
  try {
    const response = await fetch(
      "https://www.bluon.ai/api/v1/generate-chatbot-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "YourApp/1.0",
        },
        body: JSON.stringify(payload),
      }
    )

    const responseText = await response.text()

    if (!response.ok) {
      console.error("Token generation failed:", {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
        payload: payload,
      })

      throw new Error(
        `Token generation failed: ${response.status} - ${responseText}`
      )
    }

    return JSON.parse(responseText)
  } catch (error) {
    console.error("Token generation error:", error)
    throw error
  }
}
```

#### 4. iframe Not Loading

**Problem**: Blank iframe or loading indefinitely

**Solution**:

```javascript
// Check iframe loading status
function checkIframeStatus() {
  const iframe = document.getElementById("bluon-iframe")

  // Check if iframe exists
  if (!iframe) {
    console.error("Iframe element not found")
    return
  }

  // Check iframe source
  console.log("Iframe src:", iframe.src)

  // Check if iframe is loaded
  iframe.onload = () => {
    console.log("Iframe loaded successfully")

    // Check if contentWindow is accessible
    try {
      if (iframe.contentWindow) {
        console.log("Iframe contentWindow accessible")
      } else {
        console.error("Iframe contentWindow not accessible")
      }
    } catch (error) {
      console.error("Error accessing iframe contentWindow:", error)
    }
  }

  iframe.onerror = (error) => {
    console.error("Iframe loading error:", error)
  }
}
```

### Debug Mode

Enable debug mode for detailed logging:

```javascript
// Add to your integration
const DEBUG_MODE = process.env.NODE_ENV === "development"

class BluonDebugger {
  static log(message, data = null) {
    if (!DEBUG_MODE) return

    console.log(`[Bluon AI Debug] ${message}`, data || "")
  }

  static error(message, error = null) {
    if (!DEBUG_MODE) return

    console.error(`[Bluon AI Error] ${message}`, error || "")
  }

  static time(label) {
    if (!DEBUG_MODE) return
    console.time(`[Bluon AI] ${label}`)
  }

  static timeEnd(label) {
    if (!DEBUG_MODE) return
    console.timeEnd(`[Bluon AI] ${label}`)
  }
}

// Usage in your integration
BluonDebugger.time("Token Generation")
const token = await generateToken()
BluonDebugger.timeEnd("Token Generation")
BluonDebugger.log("Token generated successfully")
```

## Support

For additional help:

1. **Documentation**: Check this guide and the [API documentation](API_GATEWAY_AUTHENTICATION.md)
2. **GitHub Issues**: Report bugs or feature requests
3. **Email Support**: Contact the Bluon AI team
4. **Community Forum**: Join discussions with other developers

---

_Last updated: December 2024_
_Version: 2.0.0_
