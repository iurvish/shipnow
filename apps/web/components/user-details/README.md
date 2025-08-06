# User Detail Panel System

This system provides a comprehensive side panel interface for displaying user details, similar to the document panel in the Vercel AI chatbot. It includes responsive design, smooth animations, and automatic opening when people are found.

## Components

### 1. UserDetailPanel

- **File**: `components/user-details/user-detail-panel.tsx`
- **Purpose**: Main side panel component that displays comprehensive user information
- **Features**:
  - Responsive design (full width on mobile, max-width on desktop)
  - Detailed user information display
  - Contact actions and external links
  - Smooth animations and transitions
  - Error handling for missing data

### 2. UserPreviewCard

- **File**: `components/user-details/user-preview-card.tsx`
- **Purpose**: Compact user card for the chat interface
- **Features**:
  - Clickable card to open detail panel
  - Visual selection indicator
  - Quick action buttons
  - Skill badges and experience level
  - Responsive layout

### 3. UserDetailSkeleton

- **File**: `components/user-details/user-detail-skeleton.tsx`
- **Purpose**: Loading skeleton for the detail panel
- **Features**:
  - Matches the layout of the actual panel
  - Smooth loading animations
  - Proper spacing and proportions

### 4. UserDetailProvider & useUserDetail

- **File**: `components/user-details/user-detail-context.tsx`
- **Purpose**: Context provider for managing panel state
- **Features**:
  - Global state management
  - Automatic panel opening
  - Smooth closing with animation delays

## Usage

### Basic Setup

1. Wrap your app with the `UserDetailProvider`:

```tsx
import { UserDetailProvider } from "@/components/user-details";

export default function Layout({ children }) {
  return <UserDetailProvider>{children}</UserDetailProvider>;
}
```

2. Include the `UserDetailPanel` in your main component:

```tsx
import { UserDetailPanel, useUserDetail } from "@/components/user-details";

function MyComponent() {
  const { selectedUser, isDetailPanelOpen, closeDetailPanel } = useUserDetail();

  return (
    <div>
      {/* Your content */}

      <UserDetailPanel
        isOpen={isDetailPanelOpen}
        onClose={closeDetailPanel}
        user={selectedUser}
      />
    </div>
  );
}
```

3. Use preview cards to trigger the panel:

```tsx
import { UserPreviewCard, useUserDetail } from "@/components/user-details";

function UserList({ users }) {
  const { openDetailPanel, selectedUser } = useUserDetail();

  return (
    <div className="flex gap-3">
      {users.map((user) => (
        <UserPreviewCard
          key={user.id}
          user={user}
          isSelected={selectedUser?.id === user.id}
          onClick={() => openDetailPanel(user)}
        />
      ))}
    </div>
  );
}
```

## Features

### Automatic Panel Opening

- When people are found via search, the panel automatically opens with the first person selected
- Implemented in `ChatResponseComponent` with useEffect

### Responsive Design

- Mobile: Full width panel
- Desktop: Fixed max-width (448px/28rem)
- Proper touch interactions

### Visual States

- Selected user highlighting in preview cards
- Disabled states for missing contact information
- Loading skeletons during data fetching

### Data Handling

- Graceful handling of missing data fields
- Fallback values for empty names/emails
- Safe navigation for nested objects

### Styling Integration

- Matches the project's design system
- Uses consistent border radius (0px for outer elements)
- Proper color schemes for light/dark modes
- Clip-path styling where appropriate

## Data Structure

The system expects user data in the following format:

```typescript
interface DatabasePerson {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  bio: string | null;
  personal_details: {
    university: string;
    department: string;
    degree_level: string;
    date_of_birth: string | null;
  } | null;
  technical_profile: {
    skills: string[];
    experience: string;
    github: string | null;
    portfolio: string | null;
  } | null;
}
```

## Styling Notes

- Uses Tailwind CSS with custom clip-path styling for geometric borders
- Implements proper spacing and typography hierarchy
- Includes hover states and smooth transitions
- Supports both light and dark themes
- Uses semantic color tokens (muted, foreground, etc.)

## Integration with Chat System

The panel system is fully integrated with the chat interface:

1. When AI finds people, `ChatResponseComponent` displays `UserPreviewCard` components
2. Clicking a card opens the `UserDetailPanel` with that user's information
3. The first user is automatically selected when results are shown
4. Panel state is managed globally through React Context

This creates a seamless experience similar to the Vercel AI chatbot's document panel system.
