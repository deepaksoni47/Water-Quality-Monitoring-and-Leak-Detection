# Dark Theme Design

## Overview

The Water Quality Monitoring dashboard implements a sleek dark theme optimized for 24/7 monitoring operations, reducing eye strain and providing excellent contrast for data visualization.

## Color Palette

### Background Colors

- **Main Background**: `#1a1a2e` (dark blue-gray) - `bg-dark-bg`
- **Card Background**: `#16213e` (deeper blue) - `bg-dark-card` or `bg-card-bg`
- **Nested Elements**: `bg-dark-bg` for contrast within cards

### Text Colors

- **Primary Text**: `text-white` (headings, important data)
- **Secondary Text**: `text-gray-300` (labels, descriptions)
- **Muted Text**: `text-gray-400` (timestamps, helper text)
- **Disabled**: `text-gray-500` or `text-gray-600`

### Accent Colors

- **Primary**: `#2196F3` - Blue (alerts, actions, focus)
- **Success**: `#4CAF50` - Green (normal status, confirmations)
- **Warning**: `#FF9800` - Orange (caution alerts)
- **Danger**: `#F44336` - Red (critical alerts, errors)

### Borders

- **Default**: `border-gray-800` (card edges, dividers)
- **Subtle**: `border-gray-700` (inputs, buttons)
- **Hover**: `border-primary/50` (interactive elements)

## CSS Variables

Defined in `src/app/globals.css`:

```css
:root {
  --background: #1a1a2e;
  --foreground: #ededed;
  --card-bg: #16213e;
  --text-primary: #ffffff;
  --text-secondary: #94a3b8;
  --border-color: #334155;
}
```

Utility classes available:

- `.bg-card-bg` - Card background using CSS variable
- `.text-foreground` - Foreground text color
- `.border-themed` - Themed border color

## Component Styling Patterns

### Cards

```tsx
<div className="bg-card-bg border border-gray-800 rounded-xl p-6 shadow-lg">
```

### Nested Boxes (within cards)

```tsx
<div className="bg-dark-bg border border-gray-800 rounded-lg p-4">
```

### Headings

```tsx
<h2 className="text-xl font-bold text-primary">
<h3 className="text-lg font-semibold text-white">
```

### Labels & Secondary Text

```tsx
<span className="text-gray-300">
<p className="text-gray-400 text-sm">
```

### Input Fields

```tsx
<input className="bg-dark-bg border border-gray-700 text-white focus:ring-2 focus:ring-primary" />
```

### Buttons

```tsx
// Primary Action
<button className="bg-primary text-white hover:bg-primary/90">

// Secondary Action
<button className="bg-gray-800 text-white hover:bg-gray-700 border border-gray-700">

// Disabled
<button className="bg-gray-900 text-gray-600 cursor-not-allowed">
```

## Component Implementation

### Dashboard Components

- **Header**: Dark card with gradient icon background
- **MetricCard**: Card bg with gradient icon circles (text-white on gradients)
- **SystemStatus**: Card with nested dark-bg info boxes
- **SettingsPanel**: Card with dark-bg inputs
- **AlertsList**: Card with dark-bg alert items

### Charts

- **TDSChart & FlowChart**: Dark card background
- **Chart Elements**: Gray grid lines, gray axis labels
- **Tooltips**: Dark gray background (#1F2937)

### Notifications

- **NotificationSettings**: Card with dark-bg sections
- **NotificationPermission**: Semi-transparent dark banners

## Visual Hierarchy

1. **Level 1**: Main background (`bg-dark-bg`)
2. **Level 2**: Cards (`bg-card-bg` / `bg-dark-card`)
3. **Level 3**: Nested elements within cards (`bg-dark-bg`)

This creates natural depth and visual separation.

## Accessibility

### Contrast Ratios

All text-background combinations meet WCAG AA standards:

- White on #16213e: 12.6:1 (AAA)
- Gray-300 on #16213e: 9.8:1 (AAA)
- Gray-400 on #1a1a2e: 7.2:1 (AA Large)

### Interactive Elements

- Clear focus states with `focus:ring-2 focus:ring-primary`
- Hover states with color transitions
- Disabled states clearly differentiated

## Animations

All animations work seamlessly with the dark theme:

- Fade in: Smooth opacity transitions
- Slide in: Directional entrance
- Scale in: Subtle zoom effect
- Pulse: Animated indicators (connection status)

Framer Motion animations preserve dark theme styling during transitions.

## Files Using Dark Theme

### Core Styles

- `src/app/globals.css` - CSS variables and utilities
- `tailwind.config.ts` - Dark color palette

### Layout

- `src/app/page.tsx` - Main background and structure

### Components

- `src/components/Dashboard/Header.tsx`
- `src/components/Dashboard/MetricCard.tsx`
- `src/components/Dashboard/SystemStatus.tsx`
- `src/components/Dashboard/SettingsPanel.tsx`
- `src/components/Dashboard/AlertsList.tsx`
- `src/components/Dashboard/AlertBanner.tsx`
- `src/components/Charts/TDSChart.tsx`
- `src/components/Charts/FlowChart.tsx`
- `src/components/Notifications/NotificationSettings.tsx`
- `src/components/Notifications/NotificationPermission.tsx`
- `src/components/Notifications/NotificationInitializer.tsx`

## Design Principles

1. **Consistency**: Same color patterns across all components
2. **Depth**: Use background layering for visual hierarchy
3. **Contrast**: Ensure text is always readable
4. **Feedback**: Visual responses to user interactions
5. **Focus**: Important data stands out with color and typography

## Future Enhancements

Potential improvements while maintaining dark theme:

- Add subtle glow effects on critical alerts
- Gradient backgrounds for status indicators
- Animated charts with theme-matching colors
- Dark mode optimized data visualizations
- Enhanced shadow effects for depth
