# UI Component Library

This directory contains reusable UI components built with Tailwind CSS.

## Available Components

### Button
A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={() => {}}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: boolean
- `type`: 'button' | 'submit' | 'reset'

### Input
Form input component with label, error, and helper text support.

```tsx
import { Input } from '@/components/ui';

<Input 
  label="Email"
  type="email"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- Plus all standard HTML input attributes

### Modal
Modal dialog with overlay and close functionality.

```tsx
import { Modal } from '@/components/ui';

<Modal isOpen={open} onClose={() => setOpen(false)} title="My Modal">
  <p>Modal content</p>
</Modal>
```

**Props:**
- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string (required)
- `children`: ReactNode

### Table
Responsive table component with clickable rows.

```tsx
import { Table } from '@/components/ui';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' }
];

const data = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];

<Table 
  columns={columns}
  data={data}
  onRowClick={(row) => console.log(row)}
/>
```

### Card
Content card with optional title and footer.

```tsx
import { Card } from '@/components/ui';

<Card 
  title="Card Title"
  footer={<Button>Action</Button>}
>
  Card content
</Card>
```

### Badge
Small status indicator with multiple variants.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="md">Active</Badge>
```

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md' | 'lg'

### Tabs
Tabbed interface for content switching.

```tsx
import { Tabs } from '@/components/ui';

const tabs = [
  { id: '1', label: 'Tab 1', content: <div>Content 1</div> },
  { id: '2', label: 'Tab 2', content: <div>Content 2</div> }
];

<Tabs tabs={tabs} defaultTab="1" />
```

### Breadcrumb
Navigation breadcrumb with React Router integration.

```tsx
import { Breadcrumb } from '@/components/ui';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Details' }
];

<Breadcrumb items={items} />
```

### Dropdown
Dropdown menu with click-outside detection.

```tsx
import { Dropdown } from '@/components/ui';

const items = [
  { label: 'Profile', onClick: () => {} },
  { label: 'Logout', onClick: () => {} }
];

<Dropdown 
  trigger={<Button>Menu</Button>}
  items={items}
  align="right"
/>
```

### Alert
Alert/notification component with multiple variants.

```tsx
import { Alert } from '@/components/ui';

<Alert variant="success" onClose={() => {}}>
  Operation successful!
</Alert>
```

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `onClose`: () => void (optional)

### Spinner
Loading spinner with multiple sizes.

```tsx
import { Spinner } from '@/components/ui';

<Spinner size="lg" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'

## Usage

All components can be imported from the barrel export:

```tsx
import { Button, Input, Modal, Table } from '@/components/ui';
```

## Styling

All components are styled with Tailwind CSS and follow the design system defined in `tailwind.config.js`.

### Color Palette
- **Primary**: Blue (#2563eb)
- **Gray Scale**: 50-900
- **Semantic Colors**: Success (green), Warning (yellow), Danger (red), Info (blue)

### Typography
- **Font Family**: Inter, system-ui, sans-serif
- **Font Sizes**: Defined using Tailwind's default scale

## Demo

Visit `/components` route to see all components in action.

## Responsive Design

All components are responsive and work across mobile, tablet, and desktop breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
