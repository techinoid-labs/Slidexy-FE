# LinkedIn Integration Guide - Frontend

Complete guide for using LinkedIn OAuth and sharing functionality in the Neuro Engine frontend (slidesX-FE).

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup & Installation](#setup--installation)
4. [Context & Hooks](#context--hooks)
5. [Components](#components)
6. [Usage Examples](#usage-examples)
7. [OAuth Flow](#oauth-flow)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The LinkedIn integration provides a complete OAuth 2.0 authentication flow and sharing functionality, allowing users to:
- **Connect** their LinkedIn account securely
- **Share** individual presentation slides to LinkedIn with custom messages
- **Share** custom images/content to LinkedIn
- **Manage** their LinkedIn connection status and disconnect when needed

### Tech Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **State Management**: React Context API + Redux
- **HTTP Client**: Axios
- **UI Library**: Material-UI (MUI)
- **Authentication**: NextAuth (existing)
- **OAuth Provider**: LinkedIn API v2

---

## Architecture

### High-Level Flow

```
User Interface
    ↓
LinkedInContext (State Management)
    ↓
useLinkedIn Hook
    ↓
API Endpoints (/api/linkedin/*)
    ↓
Backend LinkedInService
    ↓
LinkedIn API v2
```

### Components Structure

```
src/app/
├── context/
│   └── LinkedInContext.tsx          # Main context + useLinkedIn hook
├── components/linkedin/
│   ├── LinkedInConnectButton.tsx    # OAuth initiation button
│   ├── LinkedInStatusBadge.tsx      # Connection status display
│   ├── LinkedInShareDialog.tsx      # Share dialog with message input
│   ├── LinkedInShareButton.tsx      # Share button (integrated in editor)
│   ├── LinkedInShareMenu.tsx        # Dropdown menu with actions
│   ├── LinkedInCallbackHandler.tsx  # OAuth callback processor
│   └── index.ts                     # Exports
├── hooks/
│   └── useLinkedInShare.ts          # Slide capture & share logic
└── linkedin/
    └── callback/
        └── page.tsx                 # OAuth callback route
```

---

## Setup & Installation

### 1. Provider Configuration

The `LinkedInProvider` is already wrapped in `src/app/provider/Provider.tsx`:

```tsx
<LinkedInProvider>
  <TemplateSlidesProvider>
    <SlidesProvider>
      {children}
    </SlidesProvider>
  </TemplateSlidesProvider>
</LinkedInProvider>
```

**Already Configured** ✅ No manual setup needed.

### 2. OAuth Callback Route

Route `/app/linkedin/callback/page.tsx` is already created to handle LinkedIn redirects.

**Already Configured** ✅

### 3. Environment Variables

Frontend uses: `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`

Backend handles: LinkedIn Client ID, Client Secret, Redirect URI (in `.env`)

**Already Configured** ✅

---

## Context & Hooks

### LinkedInContext

Located at `src/app/context/LinkedInContext.tsx`

**Provides:**

```typescript
type LinkedInContextType = {
  // Connection State
  isConnected: boolean                    // Is LinkedIn connected?
  connectionLoading: boolean              // Loading state
  connectionError: string | null          // Error message
  connectionStatus: {
    connected: boolean
    tokenValid: boolean
    profile: {
      id: string
      name: string
      email: string
      picture: string
    } | null
    expiryDate: string | null
  } | null

  // Methods
  initiateAuth: () => Promise<string | null>              // Get auth URL
  handleCallback: (code, state) => Promise<boolean>       // Process callback
  disconnect: () => Promise<boolean>                      // Disconnect account
  shareSlide: (params) => Promise<{success, message}>    // Share slide
  shareCustomContent: (params) => Promise<{success, message}>
  refreshConnectionStatus: () => Promise<void>            // Refresh status
}
```

### useLinkedIn Hook

Simple hook to access LinkedIn context:

```tsx
import { useLinkedIn } from "@/app/context/LinkedInContext";

function MyComponent() {
  const {
    isConnected,
    connectionLoading,
    initiateAuth,
    shareSlide,
  } = useLinkedIn();

  // Use the context...
}
```

**Must be used inside LinkedInProvider** ✅ Already configured globally.

---

## Components

### 1. LinkedInConnectButton

Initiates OAuth flow. Shows "Connected" when linked.

**Props:**
```typescript
interface LinkedInConnectButtonProps {
  onAuthUrl?: (url: string) => void;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  sx?: any;
}
```

**Usage:**
```tsx
import { LinkedInConnectButton } from "@/app/components/linkedin";

export default function MyPage() {
  return (
    <LinkedInConnectButton
      variant="contained"
      size="medium"
      onAuthUrl={(url) => {
        // Optional: custom handling
        window.open(url, "linkedin-auth", "width=500,height=600");
      }}
    />
  );
}
```

### 2. LinkedInStatusBadge

Shows connection status with profile picture/name.

**Props:**
```typescript
interface LinkedInStatusBadgeProps {
  showProfile?: boolean;
  size?: "small" | "medium";
  sx?: any;
}
```

**Usage:**
```tsx
import { LinkedInStatusBadge } from "@/app/components/linkedin";

export default function StatusBar() {
  return <LinkedInStatusBadge showProfile={true} size="medium" />;
}
```

### 3. LinkedInShareDialog

Dialog to share content with custom message.

**Props:**
```typescript
interface LinkedInShareDialogProps {
  open: boolean;
  onClose: () => void;
  presentationId?: string;
  slideIndex?: number;
  slideThumbnail?: string;
  slideTitle?: string;
}
```

**Usage:**
```tsx
import { LinkedInShareDialog } from "@/app/components/linkedin";
import { useState } from "react";

export default function SharePage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Share</button>
      <LinkedInShareDialog
        open={open}
        onClose={() => setOpen(false)}
        presentationId="123"
        slideIndex={0}
        slideTitle="My Slide"
      />
    </>
  );
}
```

### 4. LinkedInShareButton

Integrated share button for editor (desktop + mobile).

**Already integrated in:** `src/app/components/modify-presentation/Upper-NavBar.tsx`

**Usage in custom navbar:**
```tsx
import { LinkedInShareButton } from "@/app/components/linkedin";

export default function CustomNavBar() {
  return (
    <nav>
      <LinkedInShareButton sx={{ mr: 2 }} />
    </nav>
  );
}
```

### 5. LinkedInShareMenu

Dropdown menu with share and disconnect options.

**Props:**
```typescript
interface LinkedInShareMenuProps {
  onShareSlide?: () => void;
  onShareCustom?: () => void;
  onDisconnect?: () => void;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  sx?: any;
}
```

**Usage:**
```tsx
import { LinkedInShareMenu } from "@/app/components/linkedin";

export default function EditorToolbar() {
  return (
    <LinkedInShareMenu
      onShareSlide={() => console.log("Share slide")}
      onShareCustom={() => console.log("Share custom")}
      onDisconnect={() => console.log("Disconnected")}
    />
  );
}
```

### 6. LinkedInCallbackHandler

Handles OAuth callback redirect. **Already configured** at `/linkedin/callback`.

---

## Usage Examples

### Example 1: Simple Connect Button in Sidebar

```tsx
"use client";

import { LinkedInConnectButton, LinkedInStatusBadge } from "@/app/components/linkedin";

export default function SideBar() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>LinkedIn</h2>
      
      {/* Show current status */}
      <LinkedInStatusBadge showProfile={true} />
      
      {/* Connect button (auto-disabled if connected) */}
      <LinkedInConnectButton variant="outlined" fullWidth style={{ marginTop: "10px" }} />
    </div>
  );
}
```

### Example 2: Share Current Slide

```tsx
"use client";

import { useState } from "react";
import { LinkedInShareDialog } from "@/app/components/linkedin";
import { useLinkedIn } from "@/app/context/LinkedInContext";
import { useSearchParams } from "next/navigation";

export default function SlideViewer() {
  const { isConnected } = useLinkedIn();
  const [shareOpen, setShareOpen] = useState(false);
  const searchParams = useSearchParams();
  const presentationId = searchParams.get("pid");

  if (!isConnected) {
    return <p>Please connect LinkedIn first</p>;
  }

  return (
    <>
      <button onClick={() => setShareOpen(true)}>Share Slide</button>
      
      <LinkedInShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        presentationId={presentationId}
        slideIndex={0}
        slideTitle="My Presentation"
      />
    </>
  );
}
```

### Example 3: Custom Share Flow

```tsx
"use client";

import { useLinkedIn } from "@/app/context/LinkedInContext";

export default function CustomShareFlow() {
  const { isConnected, initiateAuth, shareSlide, connectionError } = useLinkedIn();

  const handleShare = async () => {
    if (!isConnected) {
      // Initiate auth
      const authUrl = await initiateAuth();
      if (authUrl) {
        window.open(authUrl, "linkedin-auth", "width=500,height=600");
      }
      return;
    }

    // Share the slide
    const result = await shareSlide({
      presentationId: "pres-123",
      slideIndex: 2,
      message: "Check out this amazing slide!",
    });

    if (result.success) {
      alert("✅ Shared to LinkedIn!");
    } else {
      alert(`❌ Share failed: ${result.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleShare}>
        {isConnected ? "Share to LinkedIn" : "Connect & Share"}
      </button>
      {connectionError && <p style={{ color: "red" }}>{connectionError}</p>}
    </div>
  );
}
```

---

## OAuth Flow

### Step-by-Step Flow

1. **User clicks "Connect LinkedIn"**
   - Frontend calls `GET /api/linkedin/auth` (backend endpoint)
   - Backend generates random state and stores in user record
   - Backend returns authorization URL

2. **User authorizes on LinkedIn**
   - Frontend opens OAuth URL in new window
   - User sees LinkedIn consent screen
   - User clicks "Allow"

3. **LinkedIn redirects to callback**
   - LinkedIn redirects to: `http://localhost:5000/api/linkedin/callback?code=...&state=...`
   - Backend validates state (CSRF protection)
   - Backend exchanges code for access token
   - Backend saves token to user record
   - Backend redirects to: `http://localhost:3000/linkedin/callback?success=true`

4. **Frontend processes callback**
   - `LinkedInCallbackHandler` component handles redirect
   - Shows success/error message
   - Auto-redirects back to presentation after 3 seconds
   - Context automatically refreshes connection status

### Sequence Diagram

```
User              Browser           Frontend          Backend           LinkedIn
 │                   │                 │                 │                 │
 │─── Click Connect ──│                 │                 │                 │
 │                   │──── GET /auth ──│                 │                 │
 │                   │                 │─ Generate state │                 │
 │                   │                 │─ Save state in DB                │
 │                   │◄─── authUrl ────│                 │                 │
 │                   │─ Open window ──────────────────────────────────────│
 │                   │                 │                 │─ OAuth consent ─│
 │─── Authorize ─────│                 │                 │ (user in popup) │
 │                   │                 │                 │◄─ Authorize ───│
 │                   │                 │  ◄─ Redirect ───────────────────│
 │                   │◄── Redirect ────│ /api/linkedin/callback?code=X   │
 │                   │ /linkedin/callback?success=true    │                 │
 │◄── Redirect ──────│                 │                 │                 │
 │ Connected! ✓      │                 │                 │                 │
```

---

## Troubleshooting

### Issue: "LinkedIn not connected" but button shows as connected

**Solution:**
```tsx
import { useLinkedIn } from "@/app/context/LinkedInContext";

function DebugComponent() {
  const { refreshConnectionStatus } = useLinkedIn();

  return (
    <button onClick={refreshConnectionStatus}>
      Refresh LinkedIn Status
    </button>
  );
}
```

### Issue: "Missing device fingerprint" during registration

**This is on the register endpoint**, not LinkedIn. Already fixed in backend.

### Issue: Sharing fails with "No content to share"

Ensure:
```tsx
// ✓ Provide presentationId
<LinkedInShareDialog
  presentationId="pres-123"  // ← This is required
  slideIndex={0}
/>

// OR provide image URL
<LinkedInShareDialog
  slideThumbnail="https://example.com/image.png"  // ← Or this
/>
```

### Issue: OAuth window opens but nothing happens

**Check:**
1. Backend running on `http://localhost:5000`
2. Callback route created: `src/app/linkedin/callback/page.tsx` ✅
3. No CORS errors in browser console
4. LinkedIn credentials correct in backend `.env`

**Debug:**
```tsx
<LinkedInConnectButton
  onAuthUrl={(url) => {
    console.log("OAuth URL:", url);
    window.open(url);
  }}
/>
```

### Issue: Slide sharing fails

**Check:**
- LinkedIn is connected: `useLinkedIn().isConnected === true`
- Presentation ID exists in URL params
- Backend `/api/linkedin/share` endpoint is working
- Network tab shows successful request to backend

**Verify:**
```tsx
import { useLinkedIn } from "@/app/context/LinkedInContext";

function DebugShare() {
  const { isConnected, connectionError } = useLinkedIn();
  
  return (
    <div>
      <p>Connected: {String(isConnected)}</p>
      {connectionError && <p style={{color: 'red'}}>Error: {connectionError}</p>}
    </div>
  );
}
```

### Issue: "Invalid or expired state parameter"

**Cause:** OAuth session expired (10 minutes)

**Solution:** User needs to click "Connect LinkedIn" again

---

## API Endpoints Summary

All endpoints require JWT token in header: `Authorization: Bearer <token>`

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | `/api/linkedin/auth` | Get authorization URL | `{ authUrl: "https://..." }` |
| GET | `/api/linkedin/callback` | Handle OAuth redirect | Redirects to frontend |
| GET | `/api/linkedin/status` | Check connection status | `{ connected, tokenValid, profile, expiryDate }` |
| POST | `/api/linkedin/share` | Share a slide | `{ success, message }` |
| POST | `/api/linkedin/share-custom` | Share image URL | `{ success, message }` |
| DELETE | `/api/linkedin/disconnect` | Disconnect account | `{ success }` |

---

## Advanced Usage

### Custom Share Dialog

```tsx
import { useLinkedIn } from "@/app/context/LinkedInContext";
import { useState } from "react";

export default function CustomShareDialog() {
  const { shareSlide, connectionLoading } = useLinkedIn();
  const [message, setMessage] = useState("");

  const handleShare = async () => {
    const result = await shareSlide({
      presentationId: "pres-123",
      slideIndex: 0,
      message,
    });
    console.log("Share result:", result);
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What do you want to say?"
      />
      <button onClick={handleShare} disabled={connectionLoading}>
        Post to LinkedIn
      </button>
    </div>
  );
}
```

### Auto-Refresh Connection Status

```tsx
import { useLinkedIn } from "@/app/context/LinkedInContext";
import { useEffect } from "react";

export default function AutoRefresh() {
  const { refreshConnectionStatus } = useLinkedIn();

  useEffect(() => {
    // Refresh every 5 minutes
    const interval = setInterval(refreshConnectionStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshConnectionStatus]);

  return <div>LinkedIn status auto-refreshing...</div>;
}
```

---

## Testing Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Logged in as test user
- [ ] LinkedIn connect button appears in editor
- [ ] Click connect → opens LinkedIn OAuth window
- [ ] Authorize on LinkedIn
- [ ] Redirected to `/linkedin/callback?success=true`
- [ ] Status badge shows connected profile
- [ ] Can click "Share" button
- [ ] Share dialog opens
- [ ] Can enter message and share
- [ ] LinkedIn post appears on account
- [ ] Disconnect button works
- [ ] Status updates to "Not Connected"

---

## Summary

✅ **LinkedIn integration is fully configured and ready to use!**

Key Files:
- Context: `src/app/context/LinkedInContext.tsx`
- Components: `src/app/components/linkedin/*`
- Editor Integration: `src/app/components/modify-presentation/Upper-NavBar.tsx`
- Callback Route: `src/app/linkedin/callback/page.tsx`

Start using:
```tsx
import { useLinkedIn } from "@/app/context/LinkedInContext";
import { LinkedInConnectButton, LinkedInShareDialog } from "@/app/components/linkedin";
```

For questions or issues, check the Troubleshooting section above.
