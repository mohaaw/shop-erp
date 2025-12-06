# Dynamic Store Name Implementation Plan

## Goal
Allow the user to change the "Store Name" in settings and have it instantly reflect in the application sidebar (logo and title).

## Proposed Changes

### 1. Database Schema
- Add `Settings` model to `prisma/schema.prisma` to persist store configuration.
    ```prisma
    model Settings {
      id          String   @id @default(cuid())
      storeName   String   @default("ERP-SHOP")
      supportEmail String?
      currency    String   @default("usd")
      timezone    String   @default("utc")
      updatedAt   DateTime @updatedAt
    }
    ```

### 2. State Management (Zustand)
- Create `client/lib/stores/settings-store.ts`.
- Store `storeName` and other settings.
- Provide actions to update settings.

### 3. Server Actions
- Create `client/app/actions/settings-actions.ts`.
- `getSettingsAction()`: Fetch settings (create default if none exist).
- `updateSettingsAction(data)`: Update settings.

### 4. UI Updates
- **Settings Page** (`client/app/[locale]/dashboard/settings/general/page.tsx`):
    - Fetch settings on mount (or pass initial data).
    - Update Zustand store immediately on change (optimistic).
    - Call `updateSettingsAction` on save.
- **Sidebar** (`client/app/[locale]/dashboard/layout.tsx`):
    - Subscribe to `useSettingsStore`.
    - Display dynamic `storeName`.
    - Generate initials dynamically (e.g., "My Store" -> "MS").

### 5. Server Optimization (Maxed Out)
- **Architecture**: Refactor monolithic `server.js` into `routes/` and `controllers/`.
- **Security**:
    - Install `helmet` for secure headers.
    - Install `express-rate-limit` to prevent abuse.
- **Performance**:
    - Install `compression` for Gzip response compression.
- **Logging**:
    - Install `morgan` for request logging.
- **API Expansion**:
    - Add `/api/settings` endpoint to serve dynamic store settings.

### 6. Team Hub (Real-time Collaboration)
- **Goal**: Enable real-time chat, announcements, and notifications.
- **Tech Stack**: Socket.io (Server & Client).
- **Database**:
    - `Message`: Stores chat history.
    - `Announcement`: Stores team announcements.
    - `Notification`: Stores user alerts.
- **Backend**:
    - Initialize `socket.io` on the Express server.
    - Handle events: `join_room`, `send_message`, `typing`.
- **Frontend**:
    - `SocketProvider`: Global context for socket connection.
    - `TeamHub` Page: Split view for Chat and Announcements.
    - `NotificationBell`: Real-time alert indicator in TopNav.

### 7. Comprehensive Upgrade (The "Pro" Polish) ✅
- **Goal**: Make the app feel "maxed out" and complete.
- **Dashboard**:
    - [x] Install `recharts`.
    - [x] Implement real `SalesChart` with data from `Order` table.
    - [x] Enable "Recent Orders" list with real data.
- **Navigation**:
    - [x] Implement `CommandMenu` (Cmd+K) for universal search (Products, Customers, Pages).
    - [x] Add `ThemeToggle` (Dark/Light mode) to TopNav.
    - [x] Verify `NotificationCenter` presence.
- **UI/UX**:
    - [x] Add `framer-motion` for smooth page transitions (optional, if time permits).
    - [x] Ensure all "New" buttons on list pages work.
### 8. Theme Center (Advanced Customization) ✅
- **Goal**: Allow users to fully customize the application's color scheme.
- **Database**:
    - [x] Update `Settings` model to include:
        - `primaryColor` (hex)
        - `secondaryColor` (hex)
        - `backgroundColor` (hex)
        - `textColor` (hex)
- **Logic**:
    - [x] Create `theme-generator.ts`: Utility to generate 50-950 shades from a base color.
    - [x] Update `settings-store.ts`: Handle theme updates.
    - [x] Create `ThemeManager` component: Applies CSS variables to `:root` based on store state.
- **UI**:
    - [x] Create `client/app/[locale]/dashboard/settings/appearance/page.tsx`.
    - [x] Implement `ColorPicker` component.
    - [x] Add "Theme Presets" (Blue, Green, Purple, Orange, etc.).
## Verification Plan
- Open Dashboard, see real charts and orders.
- Press Cmd+K, search for a product.
- Toggle Dark Mode.
- Check Notifications.
