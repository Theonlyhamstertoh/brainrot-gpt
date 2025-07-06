# Bluon API Gateway Authentication Migration

## Overview

Migrate from embedded JWT authentication to centralized Bluon API Gateway for better security and management.

## Current vs Proposed Architecture

**Current**: Parent Website → Bluon AI App → JWT Token → PostMessage → Cookie  
**Proposed**: Parent Website → Bluon API Gateway → JWT Token → PostMessage → Cookie

## Benefits

1. **API Key Authentication** - Secure keys instead of domain whitelisting
2. **Centralized Management** - Single auth service for all Bluon products
3. **Better Security** - Rate limiting, monitoring, revocation
4. **No Frontend Changes** - Same iframe integration

## Migration Workflow

### 1. Environment Setup

```bash
# Add API Gateway config
BLUON_API_GATEWAY_ENDPOINT=https://api-gateway.bluon.ai
BLUON_API_KEY=your-api-key-here

# Keep existing for fallback
BLUON_ENDPOINT=https://api.bluon.ai/v1
BLUON_TOKEN_KEY=your-existing-token
```

### 2. Token Generation

**API Gateway Endpoint**: `POST /auth/chatbot-token`

```typescript
// lib/auth-gateway.ts
async function generateChatbotToken(userId: string) {
  const response = await fetch(`${API_GATEWAY}/auth/chatbot-token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BLUON_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, expiresIn: "1h" }),
  })

  return response.json() // { token, expiresAt, userId }
}
```

### 3. Token Verification

**API Gateway Endpoint**: `POST /auth/verify-token`

```typescript
// lib/sessions-gateway.ts
async function verifyJWT() {
  const token = cookies().get("session")?.value
  if (!token) return null

  const { data } = await fetch(`${API_GATEWAY}/auth/verify-token`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.BLUON_API_KEY}` },
    body: JSON.stringify({ token }),
  }).then((res) => res.json())

  return data?.valid ? { sub: data.userId } : null
}
```

## API Gateway Endpoints

### Generate Token

```http
POST /auth/chatbot-token
Authorization: Bearer YOUR_API_KEY

{ "userId": "user123", "expiresIn": "1h" }
```

### Verify Token

```http
POST /auth/verify-token
Authorization: Bearer YOUR_API_KEY

{ "token": "jwt-token-here" }
```

## Migration Steps

1. **Phase 1**: Add API Gateway config alongside existing JWT system
2. **Phase 2**: Switch token generation/verification to API Gateway
3. **Phase 3**: Remove local JWT dependencies and CORS restrictions

## Frontend Integration

**No changes needed!** The iframe integration stays exactly the same:

```javascript
// Same workflow as before
const { token } = await fetch("/api/v1/generate-chatbot-token", {
  method: "POST",
  body: JSON.stringify({ id: "user123" }),
}).then((res) => res.json())

iframe.contentWindow.postMessage({ type: "auth", token }, origin)
```

## Error Handling

```typescript
const errors = {
  401: "Invalid API key",
  403: "Insufficient permissions",
  429: "Rate limit exceeded",
  500: "API Gateway error",
}
```

## Security Benefits

- **API Keys** instead of domain whitelisting
- **Rate limiting** and monitoring built-in
- **Instant revocation** of compromised keys
- **Centralized logging** across all Bluon products

This provides enterprise-grade authentication while keeping the same simple iframe integration.
