# WinCraft Backend API Reference

Comprehensive specification of the WinCraft backend REST API surface, security posture, authentication scheme, and rate-limiting rules.

---

## 1. Global Security, Headers, & Middleware

### 1.1 Transport & Framing Security
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains; preload`
- **Content-Security-Policy**: Enforced across HTML endpoints (`default-src 'self'`).
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **Cache-Control**: All `/api/*` responses return `no-store, no-cache, must-revalidate, proxy-revalidate`.

### 1.2 Cross-Origin Resource Sharing (CORS)
- **Allowed Origins**:
  - Desktop Tauri app: `tauri://localhost`, `https://tauri.localhost`
  - Local development: `http://localhost:*`, `http://127.0.0.1:*`
  - Production domains: `https://wincraft.app`, `https://*.wincraft.app`
  - Additional origins configured via `CORS_ORIGINS` environment variable.
- **Credentials**: `Access-Control-Allow-Credentials: true`
- **Exposed Headers**: `X-Session-Token` (used for sliding session renewal).

### 1.3 Payload & Error Masking Policies
- **Payload Limits**:
  - `express.json`: Max 100 KB
  - `express.urlencoded`: Max 100 KB
  - `express.raw` (`/api/stripe-webhook`): Max 1 MB
- **Production Error Masking**:
  - 400: `{ "error": "bad request" }`
  - 413: `{ "error": "payload too large" }`
  - 500: `{ "error": "internal server error" }`
  - Stack traces, file paths, and internal error messages are strictly masked and never exposed to clients.

---

## 2. Authentication & Session Model

### 2.1 JWT Session Tokens
- **Mechanism**: Bearer JWT passed in `Authorization: Bearer <token>` header.
- **TTL**: 7 days (`604800` seconds).
- **Sliding Renewal**: When an active token is older than 24 hours (`RENEW_AFTER_SECONDS = 86400`), responses include an updated token in the `X-Session-Token` header.
- **Revocation**: Backed by `users.token_version`. Invoking `/api/auth/logout-all` or completing a password reset increments `token_version`, invalidating all existing tokens immediately.

### 2.2 Rate Limiting
- **Global Auth Limiter**: 100 requests per 15 minutes per IP on `/api/auth/*`.
- **Login Limiter**: 10 attempts per minute per IP.
- **Register Limiter**: 5 account creations per hour per IP.
- **Forgot Password Limiter**: 3 requests per hour per email.
- **Reset Password Limiter**: 5 attempts per minute per IP.

---

## 3. Route Specifications

### 3.1 System Endpoints

#### `GET /health`
- **Description**: Database connectivity and service health check.
- **Auth**: None.
- **Response**:
  - `200 OK`: `{ "status": "ok", "db": true, "version": "1.0.0" }`
  - `503 Service Unavailable`: `{ "status": "degraded", "db": false }`

#### `GET /api/flags`
- **Description**: Runtime feature flags for desktop client steering.
- **Auth**: None.
- **Response**: `200 OK`: `{ "processGuardHold": boolean }`

---

### 3.2 Authentication (`/api/auth`)

#### `POST /api/auth/register`
- **Rate Limit**: 5/hr/IP.
- **Auth**: None.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Password Rules**: Minimum 8 characters, maximum 72 UTF-8 bytes, non-whitespace.
- **Response**: `201 Created`: `{ "token": "<jwt>", "user": { "id": 1, "email": "user@example.com", "emailVerified": false } }`

#### `POST /api/auth/login`
- **Rate Limit**: 10/min/IP.
- **Auth**: None.
- **Timing Protection**: Constant-time dummy verification on nonexistent accounts.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Response**: `200 OK`: `{ "token": "<jwt>", "user": { "id": 1, "email": "user@example.com" } }`

#### `POST /api/auth/logout`
- **Description**: Client-side logout acknowledgment.
- **Auth**: None.
- **Response**: `200 OK`: `{ "ok": true }`

#### `POST /api/auth/logout-all`
- **Description**: Increments user's `token_version`, revoking all active sessions across devices.
- **Auth**: Bearer token required.
- **Response**: `200 OK`: `{ "ok": true }`

#### `POST /api/auth/refresh`
- **Description**: Explicitly issues a fresh 7-day token for an authenticated user.
- **Auth**: Bearer token required.
- **Response**: `200 OK`: `{ "token": "<jwt>" }`

#### `GET /api/auth/verify-email?token=`
- **Description**: Consumes an email verification action token.
- **Auth**: None.
- **Response**: HTML confirmation page.

#### `POST /api/auth/forgot-password`
- **Rate Limit**: 3/hr/email.
- **Auth**: None.
- **Request Body**: `{ "email": "user@example.com" }`
- **Response**: `200 OK`: `{ "ok": true, "message": "If that email is registered, a reset link has been sent." }`

#### `GET /api/auth/reset-password?token=`
- **Description**: Renders HTML password reset form.
- **Auth**: None.

#### `POST /api/auth/reset-password`
- **Rate Limit**: 5/min/IP.
- **Auth**: None (Action token submitted in body or query).
- **Request Body**: `{ "token": "<64-hex-token>", "password": "NewPassword123!" }`
- **Response**: `200 OK`: HTML success page or JSON confirmation.

---

### 3.3 Account (`/api/account`)

#### `GET /api/account/me`
- **Description**: Returns authenticated user's profile and active products.
- **Auth**: Bearer token required.
- **Response**: `200 OK`:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "emailVerified": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "products": [...]
  }
  ```

#### `DELETE /api/account/me`
- **Description**: Requests GDPR-compliant account deletion (scheduled deletion with 30-day grace period).
- **Auth**: Bearer token required.
- **Response**: `200 OK`: `{ "ok": true, "scheduledFor": "<iso-date>" }`

---

### 3.4 Licensing (`/api/license`)

#### `GET /api/license?product=`
- **Description**: Generates an Ed25519-signed offline license token verifiable by desktop apps.
- **Auth**: Bearer token required.
- **Query Parameters**: `product` (default: `wincraft`)
- **Response**: `200 OK`:
  ```json
  {
    "payloadJson": "{\"userId\":\"1\",\"isPro\":true,\"plan\":\"lifetime\",\"product\":\"wincraft\",\"issuedAt\":1700000000,\"expiresAt\":null}",
    "signature": "<base64-ed25519-signature>"
  }
  ```

#### `POST /api/license/bonus`
- **Description**: Claims referral or community bonus tier.
- **Auth**: Bearer token required.
- **Response**: `200 OK`: `{ "ok": true, "tier": "bonus" }`

---

### 3.5 Entitlements (`/api/entitlements`)

#### `GET /api/entitlements`
- **Description**: Per-product entitlement map for authenticated user.
- **Auth**: Bearer token required.
- **Response**: `200 OK`: `{ "products": [...] }`

#### `GET /api/entitlements/check?email=`
- **Description**: Server-to-server cross-product discount qualification lookup.
- **Auth**: Bearer `ECOSYSTEM_API_KEY` required (returns 404 on failure to prevent probing).
- **Budget**: 600 checks/hour.
- **Response**: `200 OK`: `{ "anyActive": boolean, "products": ["wincraft"] }`

---

### 3.6 Stripe & Billing (`/api/checkout`, `/api/billing`, `/api/stripe-webhook`)

#### `POST /api/checkout`
- **Description**: Creates a Stripe Checkout session.
- **Auth**: Optional (associates session with `userId` if authenticated).
- **Request Body**:
  ```json
  {
    "plan": "lifetime" | "annual",
    "product": "wincraft" | "uninstaller",
    "email": "optional@example.com"
  }
  ```
- **Response**: `200 OK`: `{ "url": "https://checkout.stripe.com/c/pay/..." }`

#### `POST /api/billing/portal`
- **Description**: Generates a Stripe customer billing portal URL for managing subscriptions.
- **Auth**: Bearer token required.
- **Response**: `200 OK`: `{ "url": "https://billing.stripe.com/p/session/..." }`

#### `POST /api/stripe-webhook`
- **Description**: Ingests Stripe webhook events (`checkout.session.completed`, `customer.subscription.*`, etc.).
- **Auth**: HMAC signature verification against `STRIPE_WEBHOOK_SECRET` via `Stripe-Signature` header.
- **Payload Limit**: 1 MB raw JSON.
- **Response**: `200 OK`: `{ "received": true }`

---

### 3.7 Reviews & Community (`/api/reviews`)

#### `GET /api/reviews`
- **Description**: Lists approved community reviews with rating aggregates.
- **Auth**: None.
- **Response**: `200 OK`:
  ```json
  {
    "reviews": [...],
    "rating": 4.9,
    "count": 142
  }
  ```

#### `POST /api/reviews`
- **Description**: Submits a review. Inputs sanitized (null bytes and control characters stripped, HTML escaped).
- **Rate Limit**: 5/hr/IP.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "rating": 5,
    "body": "Excellent Windows utility."
  }
  ```
- **Response**: `201 Created`: `{ "ok": true }`

#### `GET /api/reviews/pending`, `POST /api/reviews/:id/approve`, `POST /api/reviews/:id/reject`
- **Description**: Admin moderation endpoints.
- **Auth**: Bearer `ADMIN_TOKEN` required (returns 404 on failure to avoid endpoint exposure).

---

### 3.8 Support & Newsletter (`/api/support`, `/api/newsletter`)

#### `POST /api/support`
- **Rate Limit**: 5/hr/IP + 60/hr global budget.
- **Request Body**: `{ "name": "...", "email": "...", "message": "..." }`
- **Response**: `200 OK`: `{ "ok": true }`

#### `POST /api/newsletter`
- **Rate Limit**: 10/hr/IP + 120/hr global budget.
- **Request Body**: `{ "email": "...", "source": "site-footer" }`
- **Response**: `200 OK`: `{ "ok": true }`

#### `GET /api/newsletter/unsubscribe?email=&token=`
- **Description**: One-click HMAC-signed unsubscribe endpoint.
- **Response**: HTML confirmation page.

---

### 3.9 Error Reports & Telemetry (`/api/error-reports`, `/api/downloads`)

#### `POST /api/error-reports`
- **Description**: Anonymous desktop crash and error reporting.
- **Rate Limit**: 30/hr/IP + 300/hr global ceiling.
- **Request Body**:
  ```json
  {
    "app": "wincraft",
    "version": "1.0.0",
    "message": "Error details...",
    "context": "cleanup"
  }
  ```
- **Response**: `204 No Content`

#### `POST /api/downloads`
- **Description**: Beacon attribution endpoint for campaign attribution.
- **Rate Limit**: 600/hr global budget.
- **Response**: `204 No Content`

#### `GET /api/downloads/stats`
- **Description**: Admin attribution statistics.
- **Auth**: Bearer `ADMIN_TOKEN` required.

---

### 3.10 Pricing & Campaigns (`/api/lifetime`, `/api/promo`)

#### `GET /api/lifetime`
- **Description**: Dynamic lifetime license pricing and availability.
- **Response**: `200 OK` or `503 Service Unavailable`.

#### `GET /api/promo`
- **Description**: Current marketing campaign state.
- **Response**: `200 OK`.
