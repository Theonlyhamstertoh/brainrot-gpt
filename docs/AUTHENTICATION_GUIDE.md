---
title: "Iframe Authentication"
description: "JWT-based authentication system with postMessage communication for secure iframe integration."
---

## Quick Start

Integrate Bluon AI in 3 simple steps:

1. **Generate Authentication Token** - Get a JWT token for your user
2. **Embed Iframe** - Add Bluon AI iframe to your page
3. **Authenticate** - Send the token to enable user sessions

## Integration Steps

| Step | What You Do                          | Result                                         |
| ---- | ------------------------------------ | ---------------------------------------------- |
| 1    | Call our token API with your user ID | Get JWT authentication token                   |
| 2    | Load Bluon AI iframe in your page    | Chatbot interface appears                      |
| 3    | Send token via postMessage           | User gets personalized chat with saved history |

<img
src="/images/image.png"
alt="image.png"
title="image.png"
style={{ width:"69%" }}
/>

## Step 1: Generate Authentication Token

**API Call**: `POST https://chat-history.bluon.ai/api/v1/generate-chatbot-token`

### Required Information

| Field        | Type   | Required    | Description              | Example         |
| ------------ | ------ | ----------- | ------------------------ | --------------- |
| `id`         | string | ✅ Yes      | Your user's unique ID    | `"user123"`     |
| `companyId`  | string | ⭕ Optional | Your company/org ID      | `"company456"`  |
| `partnerId`  | string | ⭕ Optional | Business partner ID      | `"partner789"`  |
| `supplierId` | string | ⭕ Optional | Supplier organization ID | `"supplier123"` |
| `webuserId`  | string | ⭕ Optional | Web-specific user ID     | `"webuser456"`  |

### API Example

```javascript
const response = await fetch(
  "https://chat-history.bluon.ai/api/v1/generate-chatbot-token",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: "user123", // Required
      companyId: "your-company-456", // Optional
    }),
  }
)
const { token } = await response.json()
```

## Step 2: Embed Iframe

### Basic Integration

```jsx
<iframe
  id="bluon-chatbot"
  // skip src="" because it will be initialized through the code
  width="100%"
  height="600"
  style="border: 1px solid #ddd; border-radius: 8px;"
  allow="microphone"
></iframe>
```

### Iframe Customization

| Parameter  | Description                                   | Example                   |
| ---------- | --------------------------------------------- | ------------------------- |
| `source`   | **Important**: Your company name for branding | `?source=your-company`    |
| `model_id` | Pre-load specific HVAC model (UUID)           | `?model_id=GSX130181EB`   |
| `search`   | Pre-fill search query                         | `?search=troubleshooting` |

```jsx
<iframe
  src="https://chat-history.bluon.ai/chat?source=your-company&search=troubleshooting"
  width="100%"
  height="600"
></iframe>
```

## Step 3: Authenticate User

Send the authentication token to the iframe:

```javascript
iframe.onload = function () {
  iframe.contentWindow.postMessage(
    {
      type: "auth",
      token: token,
      timestamp: Date.now(),
    },
    "https://www.bluon.ai"
  )
}
```

## Complete Working Example

Copy and test this integration:

```jsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App with Bluon AI</title>
  </head>
  <body>
    <h1>My Application</h1>

    <!-- Bluon AI Chatbot -->
    <iframe
      id="bluon-chatbot"
      width="100%"
      height="600"
      style="border: 1px solid #ddd; border-radius: 8px"
      allow="microphone"
    >
    </iframe>

    <script>
      const BLUON_URL = "https://chat-history.bluon.ai"
      const USER_ID = "user123" // Your user's ID
      const COMPANY_NAME = "your-company" // Your company identifier

      async function initializeBluonAI() {
        const iframe = document.getElementById("bluon-chatbot")

        try {
          // Step 1: Get authentication token
          const response = await fetch(
            BLUON_URL + "/api/v1/generate-chatbot-token",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: USER_ID,
                companyId: "your-company-123", // Optional
              }),
            }
          )

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const { token } = await response.json()

          // Step 2: Load iframe with your company branding
          iframe.src = `${BLUON_URL}/chat?source=${COMPANY_NAME}`

          // Step 3: Authenticate when iframe loads
          iframe.onload = function () {
            iframe.contentWindow.postMessage(
              {
                type: "auth",
                token: token,
                timestamp: Date.now(),
              },
              BLUON_URL
            )
          }

          iframe.onerror = function () {
            console.error("Iframe failed to load")
          }
        } catch (error) {
          console.error("Bluon AI integration failed:", error)
          iframe.style.display = "none"
        }
      }

      // Start integration when page loads
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeBluonAI)
      } else {
        initializeBluonAI()
      }
    </script>
  </body>
</html>
```

## User Access

| Mode              | Token       | Chat History       | Use Case        |
| ----------------- | ----------- | ------------------ | --------------- |
| **Authenticated** | ✅ Provided | Saved & Persistent | Logged-in users |
| **Anonymous**     | ❌ None     | Temporary only     | Guest users     |

## Troubleshooting

| Issue                       | Solution                                                  |
| --------------------------- | --------------------------------------------------------- |
| **CORS Error**              | Contact support to whitelist your domain                  |
| **Token Generation Failed** | Check that `id` field is provided                         |
| **Iframe Won't Load**       | Verify URL and check browser console                      |
| **Authentication Failed**   | Ensure postMessage uses exact URL: `https://www.bluon.ai` |

---

# Types

## What is "Source"?

**Source** is a branding and tracking identifier that determines:

1. **Company Branding**: Which company's theme, colors, and branding to display
2. **Analytics Tracking**: Where users are coming from for business intelligence
3. **Feature Sets**: Different features or behaviors based on the source
4. **URL Routing**: Legacy route handling and redirection

### Source Flow

```
User visits URL → Source extracted → Cookie set → Theme applied
                ↓
    analytics/mobile/b4b → source=mobile → Blue theme + MasterMechanic branding
    buildops            → source=buildops → Emerald theme + BuildOps branding
```

## Source Types

Based on `types/common.ts` and `components/company-theme-context.tsx`:

```typescript
export type SourceType = "b4b" | "mobile" | "search" | "buildops" | string
```

### Predefined Sources

| Source     | Company Name     | Theme Color | Icon                | Description                      |
| ---------- | ---------------- | ----------- | ------------------- | -------------------------------- |
| `b4b`      | MasterMechanic   | Blue        | MasterMechanic Icon | Business-to-business integration |
| `mobile`   | MasterMechanic   | Blue        | MasterMechanic Icon | Mobile application access        |
| `search`   | MasterMechanic   | Blue        | MasterMechanic Icon | Search-based entry               |
| `buildops` | BuildOps Copilot | Emerald     | BuildOps Icon       | BuildOps platform integration    |

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
