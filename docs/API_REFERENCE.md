# Bluon AI API Reference

Complete API documentation for the Bluon AI platform.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URLs](#base-urls)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [SDKs and Integration](#sdks-and-integration)

## Overview

The Bluon AI API provides access to AI-powered chat functionality, user management, analytics, and integration capabilities. The API follows REST principles and returns JSON responses.

### API Version

Current API version: `v1`

### Content Types

- Request: `application/json`
- Response: `application/json`
- File uploads: `multipart/form-data`

## Authentication

Bluon AI uses JWT-based authentication for secure API access.

### JWT Token Generation

```http
POST /api/v1/generate-chatbot-token
Content-Type: application/json

{
  "id": "user_12345",
  "companyId": "company_abc",
  "partnerId": "partner_xyz",
  "supplierId": "supplier_123",
  "webuserId": "webuser_456"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Authentication Headers

Include the JWT token in requests:

```http
Authorization: Bearer <jwt_token>
```

## Base URLs

- **Production**: `https://www.bluon.ai`
- **Staging**: `https://staging.bluon.ai`
- **Development**: `http://localhost:3000`

## API Endpoints

### Chat Management

#### Start Chat Session

```http
POST /api/v1/chat
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "messages": [
    {
      "id": "msg_123",
      "content": "Hello, I need help with HVAC installation",
      "role": "user"
    }
  ],
  "id": "chat_456",
  "pinecone": true,
  "systemPrompt": "You are a helpful HVAC assistant"
}
```

**Response:**

```json
{
  "id": "chat_456",
  "messages": [
    {
      "id": "msg_123",
      "content": "Hello, I need help with HVAC installation",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "msg_124",
      "content": "I'd be happy to help with your HVAC installation...",
      "role": "assistant",
      "createdAt": "2024-01-15T10:30:05Z"
    }
  ],
  "title": "HVAC Installation Help"
}
```

**Parameters:**

| Parameter      | Type    | Required | Description                          |
| -------------- | ------- | -------- | ------------------------------------ |
| `messages`     | Array   | Yes      | Array of message objects             |
| `id`           | String  | Yes      | Unique chat session identifier       |
| `pinecone`     | Boolean | No       | Enable vector search (default: true) |
| `systemPrompt` | String  | No       | Custom system prompt                 |
| `tool`         | String  | No       | Specific tool to use                 |
| `jobSummary`   | String  | No       | Job context summary                  |

#### Get Chat History

```http
GET /api/v1/history
Authorization: Bearer <jwt_token>
```

**Response:**

```json
[
  {
    "id": "chat_456",
    "title": "HVAC Installation Help",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:45:00Z",
    "userId": "user_12345",
    "messageCount": 8
  },
  {
    "id": "chat_789",
    "title": "Refrigerant Leak Detection",
    "createdAt": "2024-01-14T15:20:00Z",
    "updatedAt": "2024-01-14T15:35:00Z",
    "userId": "user_12345",
    "messageCount": 12
  }
]
```

### Analytics and Reporting

#### Get User Query Data

```http
GET /api/v1/posts?user_id=123&start_date=2024-01-01&end_date=2024-01-31
```

**Query Parameters:**

| Parameter     | Type   | Required | Description             |
| ------------- | ------ | -------- | ----------------------- |
| `user_id`     | String | No       | Filter by user ID       |
| `company_id`  | String | No       | Filter by company ID    |
| `partner_id`  | String | No       | Filter by partner ID    |
| `supplier_id` | String | No       | Filter by supplier ID   |
| `webuser_id`  | String | No       | Filter by web user ID   |
| `start_date`  | String | No       | Start date (YYYY-MM-DD) |
| `end_date`    | String | No       | End date (YYYY-MM-DD)   |

**Response:**

```json
{
  "user_id": "123",
  "company_id": null,
  "start_date": "2024-01-01",
  "end_date": "2024-01-31T23:59:59",
  "results": [
    {
      "query": "How to install upblast exhaust fan",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "query": "What is the proper refrigerant for R-410A systems",
      "created_at": "2024-01-16T14:20:00Z"
    }
  ]
}
```

#### Generate Summary Report

```http
GET /api/v1/summary?company_id=f50c2db8-6103-4cc1-869f-8d0adb53b655&start_date=2024-01-01&end_date=2024-01-31
```

**Response:**

```json
{
  "company_id": "f50c2db8-6103-4cc1-869f-8d0adb53b655",
  "total_questions": 156,
  "unique_users": 23,
  "start_date": "2024-01-01",
  "end_date": "2024-01-31T23:59:00",
  "summary": "Based on the questions asked, the team would benefit from additional training in: 1. Advanced HVAC troubleshooting techniques 2. New refrigerant regulations 3. Energy efficiency optimization..."
}
```

### Media and AI Services

#### Audio Transcription

```http
POST /api/v1/transcribe
Content-Type: multipart/form-data

FormData:
- file: audio_file.wav
```

**Response:**

```json
{
  "text": "How do I fix a refrigerant leak in my HVAC system?"
}
```

**Supported Audio Formats:**

- WAV
- MP3
- M4A
- FLAC

#### Text-to-Speech

```http
POST /api/v1/tts
Content-Type: application/json

{
  "text": "Hello, I can help you with HVAC troubleshooting.",
  "options": {
    "voice": "onyx",
    "voiceModel": "tts-1"
  }
}
```

**Response:**

- Binary audio data (WAV format)
- Content-Type: `audio/wav`

**Voice Options:**

- `alloy`
- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`

#### Question Suggestions

```http
POST /api/v1/suggestQuestions
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "How do I troubleshoot an HVAC system?"
    },
    {
      "role": "assistant",
      "content": "To troubleshoot an HVAC system, start by checking the thermostat settings..."
    }
  ]
}
```

**Response:**

```json
[
  "What should I check if the system isn't cooling properly?",
  "How do I know if I need to replace the air filter?",
  "What are signs of a refrigerant leak?"
]
```

### Bluon API Integration

#### Search Models by Image

```http
POST /api/external/nameplate-reader
Content-Type: multipart/form-data
Authorization: Bearer <bluon_api_token>

FormData:
- image: nameplate_image.jpg
```

**Response:**

```json
{
  "data": {
    "models": [
      {
        "id": "12345",
        "name": "Carrier 24ABC6",
        "manufacturer": "Carrier",
        "type": "Heat Pump",
        "tonnage": "5 Ton",
        "efficiency": "16 SEER",
        "confidence": 0.95
      }
    ]
  }
}
```

#### Get Model by UUID

```http
GET /api/external/models/{uuid}
Authorization: Bearer <bluon_api_token>
```

**Response:**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Carrier 24ABC6",
    "manufacturer": "Carrier",
    "modelNumber": "24ABC6",
    "type": "Heat Pump",
    "specifications": {
      "tonnage": "5 Ton",
      "efficiency": "16 SEER",
      "refrigerant": "R-410A",
      "phases": "3",
      "voltage": "460V"
    },
    "documentation": [
      {
        "type": "installation_manual",
        "url": "https://docs.carrier.com/24abc6-install.pdf"
      },
      {
        "type": "service_manual",
        "url": "https://docs.carrier.com/24abc6-service.pdf"
      }
    ]
  }
}
```

#### Search Parts

```http
GET /api/external/parts/search?query=compressor&model_id=12345
Authorization: Bearer <bluon_api_token>
```

**Response:**

```json
{
  "data": {
    "parts": [
      {
        "id": "part_789",
        "name": "Scroll Compressor - 5 Ton",
        "partNumber": "P291-0502",
        "manufacturer": "Copeland",
        "price": 1250.0,
        "availability": "In Stock",
        "description": "5 ton scroll compressor compatible with R-410A",
        "specifications": {
          "displacement": "116.5 CFM",
          "power": "4.2 KW",
          "weight": "85 lbs"
        }
      }
    ],
    "totalResults": 15,
    "page": 1,
    "pageSize": 10
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is missing required parameters",
    "details": {
      "missing_fields": ["user_id", "content"]
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_12345"
  }
}
```

### HTTP Status Codes

| Status | Code                  | Description                     |
| ------ | --------------------- | ------------------------------- |
| 200    | OK                    | Request successful              |
| 201    | Created               | Resource created successfully   |
| 400    | Bad Request           | Invalid request parameters      |
| 401    | Unauthorized          | Authentication required         |
| 403    | Forbidden             | Insufficient permissions        |
| 404    | Not Found             | Resource not found              |
| 429    | Too Many Requests     | Rate limit exceeded             |
| 500    | Internal Server Error | Server error                    |
| 503    | Service Unavailable   | Service temporarily unavailable |

### Common Error Codes

| Code                  | Description                     | Solution                |
| --------------------- | ------------------------------- | ----------------------- |
| `INVALID_TOKEN`       | JWT token is invalid or expired | Generate a new token    |
| `MISSING_PARAMETERS`  | Required parameters are missing | Check API documentation |
| `INVALID_DATE_FORMAT` | Date format is incorrect        | Use YYYY-MM-DD format   |
| `USER_NOT_FOUND`      | Specified user ID doesn't exist | Verify user ID          |
| `RATE_LIMIT_EXCEEDED` | Too many requests               | Wait before retrying    |
| `INVALID_FILE_FORMAT` | Unsupported file format         | Check supported formats |

## Rate Limiting

### Limits

| Endpoint Category | Limit        | Window   |
| ----------------- | ------------ | -------- |
| Chat API          | 60 requests  | 1 minute |
| Analytics         | 100 requests | 1 minute |
| Media Services    | 30 requests  | 1 minute |
| Authentication    | 10 requests  | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642248000
```

### Rate Limit Response

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 60
  }
}
```

## SDKs and Integration

### JavaScript/TypeScript SDK

```bash
npm install @bluon/ai-sdk
```

```typescript
import { BluonAI } from "@bluon/ai-sdk"

const client = new BluonAI({
  apiKey: "your-api-key",
  baseUrl: "https://www.bluon.ai",
})

// Start a chat
const chat = await client.chat.create({
  messages: [{ role: "user", content: "Help me with HVAC troubleshooting" }],
})

// Get chat history
const history = await client.history.list()

// Transcribe audio
const transcription = await client.audio.transcribe(audioFile)
```

### Python SDK

```bash
pip install bluon-ai-python
```

```python
from bluon_ai import BluonAI

client = BluonAI(
    api_key="your-api-key",
    base_url="https://www.bluon.ai"
)

# Start a chat
chat = client.chat.create(
    messages=[
        {"role": "user", "content": "Help me with HVAC troubleshooting"}
    ]
)

# Get analytics
analytics = client.analytics.get_posts(
    company_id="company_123",
    start_date="2024-01-01",
    end_date="2024-01-31"
)
```

### cURL Examples

#### Basic Chat Request

```bash
curl -X POST https://www.bluon.ai/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "messages": [
      {
        "id": "msg_123",
        "content": "How do I troubleshoot an HVAC system?",
        "role": "user"
      }
    ],
    "id": "chat_456",
    "pinecone": true
  }'
```

#### Get Analytics Data

```bash
curl -X GET "https://www.bluon.ai/api/v1/posts?company_id=abc123&start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Audio Transcription

```bash
curl -X POST https://www.bluon.ai/api/v1/transcribe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@audio.wav"
```

## Webhooks

### Webhook Events

| Event                        | Description                |
| ---------------------------- | -------------------------- |
| `chat.message.created`       | New message in chat        |
| `chat.session.started`       | New chat session created   |
| `chat.session.ended`         | Chat session ended         |
| `user.question.asked`        | User asked a question      |
| `analytics.report.generated` | Analytics report generated |

### Webhook Payload

```json
{
  "event": "chat.message.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "chat_id": "chat_456",
    "message_id": "msg_789",
    "user_id": "user_123",
    "content": "How do I fix this?",
    "role": "user"
  }
}
```

### Webhook Security

Webhooks are signed with HMAC-SHA256. Verify the signature:

```typescript
import crypto from "crypto"

function verifyWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")

  return signature === `sha256=${expectedSignature}`
}
```

## Testing

### Test Environment

Use the staging environment for testing:

- Base URL: `https://staging.bluon.ai`
- Test API keys available in dashboard

### Test Data

Sample test user IDs:

- `test_user_123`
- `test_company_456`
- `test_partner_789`

### Postman Collection

Download our Postman collection: [Bluon AI API Collection](https://api.bluon.ai/postman/collection.json)

## Support

- **Documentation**: [docs.bluon.ai](https://docs.bluon.ai)
- **API Status**: [status.bluon.ai](https://status.bluon.ai)
- **Support Email**: api-support@bluon.ai
- **Developer Discord**: [discord.gg/bluon-dev](https://discord.gg/bluon-dev)

---

_Last updated: December 2024_
_API Version: v1.0.0_
