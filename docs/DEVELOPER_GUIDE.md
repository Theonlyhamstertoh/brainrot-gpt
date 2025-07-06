# Bluon AI Developer Guide

Complete guide for developers working on the Bluon AI platform.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guide](#testing-guide)
- [Debugging](#debugging)
- [Performance Guidelines](#performance-guidelines)
- [Contributing](#contributing)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: 20.8.10+ (LTS recommended)
- **pnpm**: 8+ (package manager)
- **Git**: Latest version
- **VS Code**: Recommended editor with extensions

### Required VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-typescript.typescript",
    "ms-vscode.vscode-typescript-next",
    "unifiedjs.vscode-mdx",
    "ms-vscode.vscode-json",
    "ms-playwright.playwright"
  ]
}
```

### Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/bionatus/bluonai.git
cd bluonai
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET_KEY="your-super-secret-jwt-key"

# AI Services
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."

# External APIs
BLUON_ENDPOINT="https://api.bluon.ai/v1"
BLUON_TOKEN_KEY="your-bluon-api-key"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5500"

# Optional Analytics
VERCEL_ANALYTICS_ID="your-analytics-id"
```

4. **Set up the database**

```bash
# Generate database schema
pnpm drizzle:generate

# Run migrations
pnpm drizzle:migrate

# (Optional) Seed with test data
pnpm db:seed
```

5. **Start development server**

```bash
pnpm dev
```

Your application will be available at `http://localhost:3000`.

## Development Environment

### Environment Configuration

Create different environment files:

```bash
.env.local          # Local development
.env.staging        # Staging environment
.env.production     # Production environment
```

### Development Tools

#### Package Manager: pnpm

We use `pnpm` for package management:

```bash
# Install dependencies
pnpm install

# Add a new dependency
pnpm add package-name

# Add a dev dependency
pnpm add -D package-name

# Remove a dependency
pnpm remove package-name

# Update dependencies
pnpm update
```

#### Database Management: Drizzle

```bash
# Generate migrations after schema changes
pnpm drizzle:generate

# Apply migrations to database
pnpm drizzle:migrate

# Push schema changes directly (dev only)
pnpm drizzle:push

# View database in Drizzle Studio
pnpm drizzle:studio
```

### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Project Structure

```
bluonai/
├── app/                    # Next.js App Router
│   ├── (chat)/            # Route groups
│   │   └── chat/          # Chat pages
│   ├── about/             # About page
│   ├── api/               # API routes
│   │   └── v1/            # API version 1
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── chat/              # Chat-specific components
│   ├── messages/          # Message components
│   └── tools/             # AI tool components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── auth/              # Authentication logic
│   ├── db/                # Database logic
│   ├── ai/                # AI integration
│   ├── api/               # External API clients
│   ├── core/              # Core utilities
│   └── server/            # Server-side utilities
├── store/                 # State management
├── types/                 # TypeScript type definitions
├── public/                # Static assets
├── docs/                  # Documentation
└── __tests__/             # Test files
```

### File Naming Conventions

- **Components**: PascalCase (`ChatInput.tsx`)
- **Pages**: lowercase with hyphens (`chat-history.tsx`)
- **Hooks**: camelCase with `use` prefix (`useScrollAnchor.ts`)
- **Utilities**: camelCase (`generateId.ts`)
- **Types**: PascalCase (`Message.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)

### Import Organization

Order imports as follows:

```typescript
// 1. React and Next.js
import React from "react"
import { NextRequest } from "next/server"

// 2. External libraries
import { z } from "zod"
import { clsx } from "clsx"

// 3. Internal utilities and types
import { cn } from "@/lib/utils"
import type { Message } from "@/types"

// 4. Internal components
import { Button } from "@/components/ui/button"
import { ChatInput } from "@/components/chat/chat-input"

// 5. Relative imports
import "./styles.css"
```

## Development Workflow

### Git Workflow

We follow GitFlow with these branch types:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical production fixes

#### Creating a Feature

```bash
# Create and switch to feature branch
git checkout develop
git pull origin develop
git checkout -b feature/chat-voice-input

# Make your changes
git add .
git commit -m "feat: add voice input to chat"

# Push and create PR
git push origin feature/chat-voice-input
```

#### Commit Message Convention

Follow [Conventional Commits](https://conventionalcommits.org/):

```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

Examples:

```bash
git commit -m "feat(chat): add voice input support"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(api): update authentication guide"
```

### Code Review Process

1. **Create Pull Request**: Use PR template
2. **Code Review**: At least one approval required
3. **Automated Checks**: All CI checks must pass
4. **Testing**: Manual testing if needed
5. **Merge**: Squash and merge to main

#### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### Development Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm type-check       # TypeScript check
pnpm format           # Format with Prettier

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # Generate coverage
pnpm test:e2e         # End-to-end tests

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open database studio
pnpm db:seed          # Seed database
```

## Coding Standards

### TypeScript Guidelines

#### Type Definitions

```typescript
// Use interfaces for object types
interface User {
  id: string
  name: string
  email?: string // Optional properties
}

// Use type for unions and primitives
type Status = "idle" | "loading" | "success" | "error"
type UserId = string

// Use generics for reusable types
interface APIResponse<T> {
  data: T
  error?: string
}
```

#### Function Types

```typescript
// Prefer function declarations for named functions
function generateId(): string {
  return crypto.randomUUID()
}

// Use arrow functions for inline/callback functions
const users = await Promise.all(userIds.map(async (id) => fetchUser(id)))

// Async functions should always return Promise<T>
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

#### Error Handling

```typescript
// Custom error types
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthenticationError"
  }
}

// Result pattern for fallible operations
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

async function safeApiCall<T>(url: string): Promise<Result<T>> {
  try {
    const data = await fetch(url).then((r) => r.json())
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}
```

### React Component Guidelines

#### Component Structure

```typescript
// components/chat/ChatMessage.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

interface ChatMessageProps {
  message: Message
  isLoading?: boolean
  className?: string
  onEdit?: (messageId: string) => void
}

export function ChatMessage({
  message,
  isLoading = false,
  className,
  onEdit
}: ChatMessageProps) {
  // Hooks at the top
  const [isEditing, setIsEditing] = React.useState(false)

  // Event handlers
  const handleEdit = () => {
    setIsEditing(true)
    onEdit?.(message.id)
  }

  // Early returns
  if (!message) return null

  // Main render
  return (
    <div className={cn('message', className)}>
      {/* Component content */}
    </div>
  )
}
```

#### Hooks Guidelines

```typescript
// Custom hook example
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}
```

### CSS and Styling

#### Tailwind CSS Usage

```typescript
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils'

const buttonVariants = {
  default: 'bg-blue-500 text-white',
  secondary: 'bg-gray-200 text-gray-900',
  danger: 'bg-red-500 text-white'
}

function Button({ variant = 'default', className, ...props }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md font-medium transition-colors',
        buttonVariants[variant],
        className
      )}
      {...props}
    />
  )
}
```

#### Component Styling Patterns

```typescript
// 1. Base styles with variants
const styles = {
  base: 'relative rounded-lg border border-gray-200 p-4',
  variants: {
    size: {
      sm: 'p-2 text-sm',
      md: 'p-4 text-base',
      lg: 'p-6 text-lg'
    },
    variant: {
      default: 'bg-white',
      secondary: 'bg-gray-50',
      accent: 'bg-blue-50 border-blue-200'
    }
  }
}

// 2. Responsive design
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
```

### API Route Guidelines

```typescript
// app/api/v1/users/route.ts
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUserId } from "@/lib/auth/sessions"

// Input validation schema
const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  companyId: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Input validation
    const body = await request.json()
    const { name, email, companyId } = CreateUserSchema.parse(body)

    // Business logic
    const user = await createUser({ name, email, companyId })

    // Response
    return NextResponse.json({ data: user }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

## Testing Guide

### Testing Strategy

Our testing approach follows the testing pyramid:

```
┌─────────────────┐
│   E2E Tests     │ ← 5% - User workflows
├─────────────────┤
│ Integration     │ ← 15% - API routes, components
├─────────────────┤
│   Unit Tests    │ ← 80% - Functions, utilities
└─────────────────┘
```

### Unit Testing

```typescript
// __tests__/utils/generateId.test.ts
import { describe, expect, it } from "vitest"
import { generateId } from "@/lib/utils/generateId"

describe("generateId", () => {
  it("should generate a valid UUID", () => {
    const id = generateId()
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  })

  it("should generate unique IDs", () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })
})
```

### Component Testing

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles correctly', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByText('Secondary')
    expect(button).toHaveClass('bg-gray-200')
  })
})
```

### API Testing

```typescript
// __tests__/api/users.test.ts
import { createMocks } from "node-mocks-http"
import { POST } from "@/app/api/v1/users/route"

describe("/api/v1/users", () => {
  it("creates a user successfully", async () => {
    const { req } = createMocks({
      method: "POST",
      body: {
        name: "John Doe",
        email: "john@example.com",
      },
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.data).toHaveProperty("id")
    expect(data.data.name).toBe("John Doe")
  })

  it("validates input correctly", async () => {
    const { req } = createMocks({
      method: "POST",
      body: {
        name: "", // Invalid: empty name
        email: "invalid-email", // Invalid: not an email
      },
    })

    const response = await POST(req)
    expect(response.status).toBe(400)
  })
})
```

### E2E Testing with Playwright

```typescript
// __tests__/e2e/chat.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Chat functionality", () => {
  test("user can send a message and receive response", async ({ page }) => {
    await page.goto("/chat")

    // Wait for chat to load
    await expect(page.getByText("How can I help you?")).toBeVisible()

    // Send a message
    await page.fill('[data-testid="chat-input"]', "Hello, how are you?")
    await page.click('[data-testid="send-button"]')

    // Verify message appears
    await expect(page.getByText("Hello, how are you?")).toBeVisible()

    // Wait for AI response
    await expect(page.getByText(/I'm doing well/)).toBeVisible({
      timeout: 10000,
    })
  })

  test("voice input works correctly", async ({ page, context }) => {
    // Grant microphone permissions
    await context.grantPermissions(["microphone"])

    await page.goto("/chat")

    // Click voice input button
    await page.click('[data-testid="voice-input-button"]')

    // Verify recording state
    await expect(page.getByText("Recording...")).toBeVisible()
  })
})
```

### Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test-setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
```

```typescript
// test-setup.ts
import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: "/",
    query: {},
  }),
  useSearchParams: () => new URLSearchParams(),
}))

// Mock environment variables
vi.mock("process", () => ({
  env: {
    NODE_ENV: "test",
    JWT_SECRET_KEY: "test-secret",
  },
}))
```

## Debugging

### Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Debugging Techniques

#### Server-Side Debugging

```typescript
// Use console.time for performance debugging
console.time("Database Query")
const users = await getAllUsers()
console.timeEnd("Database Query")

// Use structured logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : "")
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error?.stack || error)
  },
}

// Debug API routes
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  logger.info("API call started", { url: request.url })

  try {
    // Your logic here
    const result = await processRequest(request)

    logger.info("API call completed", {
      duration: Date.now() - startTime,
      resultSize: JSON.stringify(result).length,
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error("API call failed", error as Error)
    throw error
  }
}
```

#### Client-Side Debugging

```typescript
// React DevTools integration
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Enable React DevTools
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {}
}

// Custom hook for debugging
function useDebugValue(value: any, label?: string) {
  React.useDebugValue(value, (val) =>
    label ? `${label}: ${JSON.stringify(val)}` : JSON.stringify(val)
  )
}

// Component debugging
function ChatMessage({ message }: { message: Message }) {
  // Debug rerenders
  const renderCount = React.useRef(0)
  renderCount.current++

  if (process.env.NODE_ENV === 'development') {
    console.log(`ChatMessage rendered ${renderCount.current} times`, { message })
  }

  return <div>{message.content}</div>
}
```

#### Network Debugging

```typescript
// API client with logging
async function apiCall(endpoint: string, options?: RequestInit) {
  const startTime = Date.now()

  console.log(`🚀 API Call: ${endpoint}`, options)

  try {
    const response = await fetch(endpoint, options)
    const duration = Date.now() - startTime

    console.log(`✅ API Success: ${endpoint} (${duration}ms)`, {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    })

    return response
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ API Error: ${endpoint} (${duration}ms)`, error)
    throw error
  }
}
```

## Performance Guidelines

### React Performance

#### Optimization Patterns

```typescript
// 1. Memoization
const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data,
  onUpdate
}: {
  data: ComplexData
  onUpdate: (id: string) => void
}) {
  const memoizedData = React.useMemo(() => {
    return processComplexData(data)
  }, [data])

  const memoizedCallback = React.useCallback((id: string) => {
    onUpdate(id)
  }, [onUpdate])

  return <div>{/* Render memoized data */}</div>
})

// 2. Code splitting
const LazyComponent = React.lazy(() =>
  import('./ExpensiveComponent').then(module => ({
    default: module.ExpensiveComponent
  }))
)

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  )
}

// 3. Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window'

function MessageList({ messages }: { messages: Message[] }) {
  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => (
    <div style={style}>
      <MessageItem message={messages[index]} />
    </div>
  )

  return (
    <List
      height={600}
      itemCount={messages.length}
      itemSize={80}
    >
      {Row}
    </List>
  )
}
```

#### Bundle Optimization

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons"],
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    }
    return config
  },
}
```

### Database Performance

```typescript
// Optimized queries with proper indexing
export async function getChatsByUser(userId: string, limit: number = 50) {
  return db
    .selectFrom("chats")
    .selectAll()
    .where("user_id", "=", userId)
    .orderBy("updated_at", "desc")
    .limit(limit)
    .execute()
}

// Batch operations
export async function createMessages(messages: NewMessage[]) {
  return db
    .insertInto("messages")
    .values(messages)
    .returning(["id", "created_at"])
    .execute()
}

// Connection pooling
const db = createKysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum pool size
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }),
  }),
})
```

### API Performance

```typescript
// Response streaming for large data
export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // Stream data chunks
      getLargeDataset().forEach((chunk) => {
        controller.enqueue(encoder.encode(JSON.stringify(chunk) + "\n"))
      })

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
    },
  })
}

// Caching with SWR
export function useChatHistory(userId: string) {
  return useSWR(userId ? `/api/v1/history?user_id=${userId}` : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
  })
}
```

## Contributing

### Pull Request Guidelines

1. **Branch Naming**: Use descriptive names

   - `feature/add-voice-input`
   - `fix/auth-token-expiry`
   - `docs/update-api-guide`

2. **Commit Messages**: Follow conventional commits
3. **Code Quality**: Ensure all checks pass
4. **Testing**: Add tests for new functionality
5. **Documentation**: Update relevant docs

### Code Review Checklist

#### Functionality

- [ ] Code works as expected
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] Performance considerations addressed

#### Code Quality

- [ ] Follows coding standards
- [ ] No code duplication
- [ ] Clear variable/function names
- [ ] Appropriate comments added

#### Testing

- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

#### Security

- [ ] Input validation implemented
- [ ] Authentication/authorization correct
- [ ] No sensitive data exposed
- [ ] SQL injection prevention

### Release Process

1. **Version Bump**: Update version in `package.json`
2. **Changelog**: Update `CHANGELOG.md`
3. **Testing**: Run full test suite
4. **Build**: Verify production build
5. **Deploy**: Deploy to staging first
6. **Release**: Create GitHub release
7. **Monitor**: Watch for errors post-deployment

---

_Last updated: December 2024_
_Developer Guide Version: 1.0.0_
