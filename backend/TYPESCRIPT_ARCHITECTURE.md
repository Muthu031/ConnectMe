# ConnectMe Backend - TypeScript Architecture with Advanced LLD

## 🏗️ Architecture Overview

This backend implements advanced **Low-Level Design (LLD)** patterns using **TypeScript** and **Drizzle ORM** for a production-ready, scalable social media application.

### Architecture Layers

```
┌─────────────────────────────────────────────────┐
│           HTTP Layer (Express Routes)           │
│              src/routes/*.ts                    │
├─────────────────────────────────────────────────┤
│         Controllers (Request Handlers)          │
│          src/controllers/*.ts                   │
│  - Parse HTTP requests                          │
│  - Delegate to services                         │
│  - Format responses                             │
├─────────────────────────────────────────────────┤
│         Services (Business Logic)               │
│           src/services/*.ts                     │
│  - Core business operations                     │
│  - Data validation                              │
│  - Transaction management                       │
├─────────────────────────────────────────────────┤
│    Repositories (Data Access Layer)             │
│         src/repositories/*.ts                   │
│  - Database queries (Drizzle ORM)               │
│  - Data transformation                          │
│  - Query optimization                           │
├─────────────────────────────────────────────────┤
│      Database Layer (Drizzle ORM)               │
│         src/db/schema.ts                        │
│         src/config/database.ts                  │
├─────────────────────────────────────────────────┤
│        PostgreSQL (Data Storage)                │
└─────────────────────────────────────────────────┘
```

## 📐 Design Patterns Implemented

### 1. **Repository Pattern**
- **Location**: `src/repositories/`
- **Purpose**: Abstracts data access logic from business logic
- **Benefits**:
  - Easy to test (mock repositories)
  - Switch database easier later
  - Encapsulates query logic
  
```typescript
// Define interface
export interface IRepository<T, CreateInput, UpdateInput> {
  create(data: CreateInput): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, data: Partial<UpdateInput>): Promise<T | null>;
  // ...
}

// Implement for User
export class UserRepository extends BaseRepository<...> {
  async create(data: IUserCreateInput): Promise<IUser> { }
  async findById(id: string): Promise<IUser | null> { }
  // ...
}
```

### 2. **Service/Use Case Layer**
- **Location**: `src/services/`
- **Purpose**: Contains all business logic, independent of HTTP
- **Benefits**:
  - Reusable across controllers, WebSockets, scheduled jobs
  - Centralized error handling
  - Transaction management
  
```typescript
export class UserService {
  async register(input: IUserCreateInput): Promise<...> {
    // Validation
    // Call repository
    // Generate tokens
    // Return formatted response
  }
}
```

### 3. **Dependency Injection (DI)**
- **Implementation**: Manual DI via singleton instances
- **Benefit**: Loose coupling, easy testing

```typescript
// Single instance throughout app
export const userRepository = new UserRepository();
export const userService = new UserService();
```

### 4. **Types & Interfaces**
- **Location**: `src/types/`
- **Pattern**: Strict typing throughout
- **Benefits**:
  - Type safety at compile-time
  - Better IDE support
  - Self-documenting code

```typescript
// Types define contracts
export interface IUser {
  id: string;
  username: string;
  email: string;
  // ...
}

export interface IUserCreateInput {
  username: string;
  email: string;
  password: string;
}
```

### 5. **Error Handling**
- **Custom AppError Class**: `src/types/common.types.ts`
- **Consistent Format**: All errors follow standardized structure

```typescript
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number,
    public details?: unknown
  ) { }
}

// Usage
throw new AppError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
```

### 6. **Response Formatting**
- **Standardized Response**: `IApiResponse<T>`
- **Consistent Format**: All endpoints return same structure

```typescript
interface IApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: { code: string; details?: unknown };
  timestamp: Date;
}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts              # Database initialization
│   ├── controllers/
│   │   ├── AuthController.ts        # HTTP handlers
│   │   └── ...
│   ├── db/
│   │   ├── schema.ts                # Drizzle schema definitions
│   │   └── index.ts
│   ├── middleware/
│   │   └── auth.ts                  # JWT verification
│   ├── repositories/
│   │   ├── IRepository.ts           # Interface & base class
│   │   ├── UserRepository.ts
│   │   └── ...
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── ...
│   ├── services/
│   │   ├── UserService.ts           # Business logic
│   │   └── ...
│   ├── types/
│   │   ├── common.types.ts          # Common types
│   │   ├── user.types.ts
│   │   └── ...
│   ├── utils/
│   │   └── ...
│   └── server.ts                    # Main entry point
├── tsconfig.json                    # TypeScript config
├── package.json
└── ARCHITECTURE.md                  # This file
```

## 🔄 Request Flow Example

### Register User Request

```
1. HTTP POST /api/auth/register
   ↓
2. authRoutes → AuthController.register()
   ↓
3. Request validation
   ↓
4. UserService.register() → Business Logic
   ├─ Check if user exists (UserRepository)
   ├─ Hash password
   ├─ Create user (UserRepository)
   ├─ Generate JWT tokens
   └─ Return user + tokens
   ↓
5. Format response as IApiResponse<T>
   ↓
6. HTTP 201 Created
```

## 🔐 Type Safety Example

```typescript
// UserService has complete type safety
async register(input: IUserCreateInput): Promise<{
  user: IUserResponse;
  tokens: IAuthTokens;
}> {
  // input: { username, email, phone?, password, fullName? }
  // Return type is guaranteed
}

// Controller calls service with proper types
const result = await userService.register(input);
// result.user: IUserResponse
// result.tokens: IAuthTokens
```

## 📝 API Response Format

### Success Response
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": { /* IUserResponse */ },
    "tokens": { /* IAuthTokens */ }
  },
  "timestamp": "2024-03-28T10:30:00.000Z"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "User already exists",
  "error": {
    "code": "USER_EXISTS",
    "details": null
  },
  "timestamp": "2024-03-28T10:30:00.000Z"
}
```

## 🚀 Running the Application

### Development
```bash
npm run dev          # Start with auto-reload
```

### Production
```bash
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled JavaScript
```

### Database
```bash
npm run db:migrate   # Run migrations
npm run db:seed:mock # Seed mock data
```

## 🧪 Testing Strategy

### Unit Tests (Services)
```typescript
// Test service in isolation
const userService = new UserService();
const result = await userService.register({
  username: 'test',
  email: 'test@example.com',
  password: 'password'
});
expect(result.user.username).toBe('test');
```

### Integration Tests (Routes)
```typescript
// Test full request flow
const response = await request(app)
  .post('/api/auth/register')
  .send({ /* data */ });
expect(response.status).toBe(201);
```

## ✅ Advanced TypeScript Features Used

- ✅ **Strict Mode**: All strict checks enabled
- ✅ **Generics**: `<T>` for generic repository patterns
- ✅ **Interfaces**: Complete contract definitions
- ✅ **Type Guards**: `instanceof` checks
- ✅ **Discriminated Unions**: Error types
- ✅ **Partial Types**: `Partial<T>` for updates
- ✅ **Path Aliases**: `@config`, `@services`, etc.
- ✅ **Decorators**: Ready for use with DI frameworks

## 🔄 Future Enhancements

1. **Dependency Injection Framework**: Use InversifyJS or TypeDI
2. **Event Emitters**: For decoupled operations
3. **Query Objects Pattern**: For complex queries
4. **CQRS Pattern**: Command/Query separation
5. **GraphQL**: Alternative to REST API
6. **Async Queue**: For background jobs
7. **Caching Layer**: Redis integration
8. **OpenAPI/Swagger**: Auto-generated docs

## 📚 References

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://en.wikipedia.org/wiki/Repository_pattern)
