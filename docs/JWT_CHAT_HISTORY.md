# JWT-Based Chat History Implementation

## Overview

The chat history sidebar now uses JWT authentication for authenticated users while still allowing anonymous access. This provides better security for authenticated users while maintaining accessibility for anonymous usage.

## How It Works

### 1. Authentication Flow

- **Authenticated Users**: JWT tokens are stored in cookies (via the postMessage auth system)
- **Anonymous Users**: Can access `/chat` normally without authentication
- Server-side API routes read the JWT from the `session` cookie when available
- User ID is extracted from the JWT `sub` claim for authenticated users

### 2. API Endpoint (`/api/v1/history`)

```typescript
// Before: Required user_id query parameter
GET /api/v1/history?user_id=123

// After: Uses JWT authentication with anonymous fallback
GET /api/v1/history
// - If JWT token present: Returns user's chat history
// - If no JWT token: Returns empty array (anonymous user)
```

### 3. User Experience

#### Anonymous Users

- Can access `/chat` without any authentication
- Sidebar shows: "Login to save and revisit previous chats!"
- Can chat normally but conversations are not saved/retrieved

#### Authenticated Users

- JWT token automatically provides access to chat history
- Sidebar shows previous conversations
- All chats are saved and can be revisited

### 4. Component Changes

#### AppSidebar Component

- **Removed**: `userId` prop dependency
- **Added**: Cookie-based authentication via `credentials: 'include'`
- **Added**: Anonymous user detection and appropriate messaging
- **Added**: Error handling for server errors

```typescript
// Before
<AppSidebar userId={userId} />

// After
<AppSidebar />
```

#### SWR Fetcher

```typescript
// Before: Simple fetch
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// After: Includes credentials for JWT auth
const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include", // Include cookies for JWT authentication
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
  })
```

## Security Benefits

1. **No Exposed User IDs**: User IDs are no longer passed in URLs or props
2. **JWT Validation**: All requests are cryptographically verified
3. **Automatic Expiration**: Tokens expire and require refresh
4. **Origin Validation**: CORS protection prevents unauthorized access

## Error Handling

The sidebar now handles different user states:

- **Anonymous Users**: Shows "Login to save and revisit previous chats!"
- **Authenticated Users (No Chats)**: Shows "Your conversations will appear here once you start chatting!"
- **Server Errors**: Shows "Error loading chat history"
- **Loading State**: Shows skeleton placeholders

## Testing

To test the JWT-based chat history:

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Open the integration example**:

   ```bash
   open docs/cookie-auth-example.html
   ```

3. **Generate a token** and verify the sidebar loads chat history

4. **Check browser cookies** to see the `session` cookie is set

## API Reference

### GET /api/v1/history

**Authentication**: JWT token in `session` cookie (optional for anonymous access)

**Response for Authenticated Users**:

```json
[
  {
    "id": "chat-uuid",
    "title": "Chat Title",
    "created_at": "2024-01-01T00:00:00Z",
    "userId": "user123"
  }
]
```

**Response for Anonymous Users**:

```json
[]
```

**Error Responses**:

- `500 Internal Server Error`: Database or server error

## Migration Notes

### For Existing Integrations

No changes required for existing integrations - the JWT authentication is handled automatically by the postMessage system.

### For Custom Implementations

If you have custom implementations that directly call `/api/v1/history`:

1. **Remove** `user_id` query parameters
2. **Ensure** JWT token is in the `session` cookie
3. **Include** `credentials: 'include'` in fetch requests

## Troubleshooting

### Common Issues

1. **"Login to save and revisit previous chats!"**

   - JWT token is missing or invalid
   - Check that postMessage authentication completed successfully
   - Verify the `session` cookie is set in browser dev tools

2. **"Error loading chat history"**

   - Server error or database connection issue
   - Check server logs for detailed error messages

3. **Empty chat history**
   - User has no previous chats
   - JWT token contains different user ID than expected

### Debug Steps

1. **Check browser cookies**: Look for `session` cookie with JWT value
2. **Check network requests**: Verify `/api/v1/history` returns 200 status
3. **Check server logs**: Look for JWT validation errors
4. **Test JWT token**: Use `window.jwtReceiver.getToken()` in browser console
