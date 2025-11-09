# Water Monitor Dashboard - Next.js

Modern, real-time water quality monitoring dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Real-time Updates**: Live data streaming from Firebase
- **Interactive Charts**: Beautiful visualizations with Recharts
- **Responsive Design**: Works seamlessly on all devices
- **Type-Safe**: Full TypeScript support
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Performance**: Optimized with Next.js App Router
- **Custom Hooks**: Reusable logic for data fetching

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Realtime Database
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🛠️ Installation

### Prerequisites

- Node.js 18+ installed
- Firebase project set up
- npm or yarn package manager

### Step 1: Clone/Create Project

```bash
# Create new Next.js project
npx create-next-app@latest water-monitor-dashboard --typescript --tailwind --app

# Or navigate to existing project folder
cd water-monitor-dashboard
```

### Step 2: Install Dependencies

```bash
npm install firebase recharts lucide-react date-fns clsx
```

### Step 3: Project Structure

Create the following folder structure:

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Dashboard/
│   └── Charts/
├── lib/
│   ├── firebase.ts
│   └── types.ts
└── hooks/
    ├── useRealtimeData.ts
    ├── useAlerts.ts
    └── useSystemStatus.ts
```

### Step 4: Environment Variables

Create `.env.local` file in root directory:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 5: Copy All Files

Copy all the component files, hooks, and configurations from the artifacts above into their respective folders.

### Step 6: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your dashboard!

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Realtime Database

### 2. Database Rules

Set the following rules in Firebase Console:

```json
{
  "rules": {
    "readings": {
      ".read": true,
      ".write": true
    },
    "alerts": {
      ".read": true,
      ".write": true
    },
    "notifications": {
      ".read": true,
      ".write": true
    },
    "system": {
      ".read": true,
      ".write": true
    }
  }
}
```

> **Note**: For production, use proper authentication and more restrictive rules.

### 3. Get Configuration

1. Go to Project Settings > General
2. Scroll to "Your apps"
3. Click on Web app (</>) icon
4. Copy the configuration values to `.env.local`

## 📱 Components Overview

### Dashboard Components

- **Header**: Shows connection status and branding
- **MetricCard**: Displays individual metrics with icons
- **AlertBanner**: Shows critical alerts with dismiss option
- **SystemStatus**: Shows device status and overall health
- **AlertsList**: Displays recent alerts history
- **SettingsPanel**: Allows updating expected flow rate

### Chart Components

- **TDSChart**: Line chart showing water quality over time
- **FlowChart**: Comparison of actual vs expected flow rates

### Custom Hooks

- **useRealtimeData**: Fetches current sensor readings
- **useAlerts**: Manages alerts history
- **useSystemStatus**: Monitors system and notification status

## 🎨 Customization

### Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: "#2196F3",     // Change primary color
  success: "#4CAF50",     // Change success color
  warning: "#FF9800",     // Change warning color
  danger: "#F44336",      // Change danger color
}
```

### Thresholds

Edit threshold values in the status functions within `page.tsx`:

```typescript
const getTDSStatus = (tds: number) => {
  if (tds < 50) return { text: 'Too Low', ... };
  if (tds <= 500) return { text: 'Good Quality', ... };
  // Modify these values as needed
}
```

### Chart Data Points

Modify the limit in chart components:

```typescript
const historyQuery = query(historyRef, limitToLast(20)); // Change 20 to desired number
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Other Platforms

#### Netlify

```bash
npm run build
# Deploy the .next folder
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Performance Optimization

### Image Optimization

Use Next.js Image component for any images:

```typescript
import Image from "next/image";

<Image src="/logo.png" alt="Logo" width={100} height={100} />;
```

### Code Splitting

Components are automatically code-split by Next.js. For dynamic imports:

```typescript
import dynamic from "next/dynamic";

const DynamicChart = dynamic(() => import("@/components/Charts/TDSChart"), {
  ssr: false,
  loading: () => <p>Loading chart...</p>,
});
```

## 🐛 Troubleshooting

### Firebase Connection Issues

**Problem**: "Firebase not initialized" error

**Solution**:

1. Check `.env.local` variables are correct
2. Ensure file name is exactly `.env.local`
3. Restart dev server after changing env variables

### Charts Not Rendering

**Problem**: Charts don't appear

**Solution**:

1. Check if data exists in Firebase
2. Open browser console for errors
3. Verify Recharts is installed: `npm list recharts`

### Real-time Updates Not Working

**Problem**: Data doesn't update automatically

**Solution**:

1. Check Firebase Database Rules allow read access
2. Verify network connectivity
3. Check browser console for Firebase errors

### Build Errors

**Problem**: TypeScript errors during build

**Solution**:

```bash
# Delete node_modules and reinstall
rm -rf node_modules .next
npm install
npm run build
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env.local` to git
2. **Firebase Rules**: Implement proper authentication in production
3. **API Routes**: Use Next.js API routes for sensitive operations
4. **Input Validation**: Always validate user inputs
5. **HTTPS**: Always use HTTPS in production

## 📝 Scripts

```json
{
  "dev": "next dev", // Start development server
  "build": "next build", // Build for production
  "start": "next start", // Start production server
  "lint": "next lint" // Run ESLint
}
```

## 🎯 Features Roadmap

- [ ] User authentication
- [ ] Historical data export (CSV/PDF)
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Multiple device support
- [ ] Advanced analytics dashboard
- [ ] Automated reports

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For issues and questions:

- Open an issue on GitHub
- Check existing documentation
- Review Firebase console for data issues

---

**Built with ❤️ using Next.js and Firebase**
