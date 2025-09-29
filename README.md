# AI Timetable Generation System (Nexus) - Frontend Demo

A comprehensive, intelligent timetable generation system frontend demo built with Next.js 14, featuring interactive UI, AI-powered suggestions, and professional presentation-ready interface.

> **Note**: This is a frontend-only demo application with mock data. Perfect for presentations, prototyping, and showcasing timetable management UI/UX.

## 🚀 Features

### 🎯 Demo Features
- **Interactive Timetable Grid**: Clickable cells with detailed course information
- **Mark Teacher Absent Workflow**: AI suggestions with Accept/Decline buttons and visual feedback
- **Professional Navigation**: TimetableAI branded navbar with seamless page transitions
- **Loading Animations**: 5-step AI generation simulation for realistic demo experience
- **Toast Notifications**: Beautiful success/error feedback throughout the application
- **CSV Upload/Export**: Simulated file operations with professional UI feedback

### 🤖 AI-Powered Interface
- **Smart Suggestions**: Pre-defined AI recommendations for teacher absence scenarios
- **Visual Analytics**: Interactive charts showing Teacher Satisfaction, Room Utilization, Student Compactness
- **Real-time Updates**: Dynamic timetable cell colors (red for disrupted, yellow for rescheduled)
- **Mock Intelligence**: Realistic AI assistant sidebar with contextual suggestions

### User Experience
- **Intuitive Dashboard**: Clean, modern interface built with shadcn/ui
- **Real-time Updates**: Live progress tracking and instant feedback
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Customizable theme preferences

### Demo Features
- **Interactive UI**: Full timetable management interface with click interactions
- **Mock Data**: Pre-loaded sample data for realistic demonstration
- **AI Simulation**: Simulated AI suggestions for teacher absence management
- **Analytics Dashboard**: Sample charts and insights visualization
- **CSV Upload Demo**: File upload simulation without backend processing

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router and static generation
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library with Radix UI
- **React Hook Form** - Form management and validation
- **Lucide Icons** - Beautiful icon set
- **Recharts** - Interactive charts and data visualization

### Demo Architecture
- **Static Generation** - No server-side dependencies
- **Mock Data Services** - Simulated backend responses
- **Client-side Logic** - All interactions handled in browser
- **Responsive Design** - Works on all device sizes

### Deployment & CI/CD
- **Static Export** - Next.js static generation for maximum compatibility
- **Vercel** - Recommended hosting platform with zero-config deployment
- **GitHub Actions** - Automated building and deployment pipeline
- **Multiple Platforms** - Deploy to Netlify, GitHub Pages, or any static host

## 📦 Quick Start

> **Note**: This is a frontend-only demo application. No database setup required!

### Prerequisites
- Node.js 18+ and pnpm (recommended) or npm

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd nexus
   pnpm install
   # or: npm install
   ```

2. **Start Development Server**
   ```bash
   pnpm dev
   # or: npm run dev
   ```

3. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - All data is pre-loaded from mock datasets
   - No environment configuration needed!

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Access the application at http://localhost:3000

### Production Build

1. **Create Optimized Build**
   ```bash
   pnpm build
   ```

2. **Test Production Build Locally**
   ```bash
   pnpm start
   ```

3. **Deploy to Platform**
   - Upload `out/` directory to static hosting
   - Or connect repository for automatic deployments

## 📊 Usage Guide

### Admin Dashboard
Navigate to `/admin` to access the administrative interface:

- **Analytics**: View system performance and utilization metrics
- **Timetables**: Generate and manage academic schedules
- **Programs**: Configure courses, credits, and requirements
- **Faculty**: Manage teacher profiles and availability
- **Students**: Handle enrollment and course assignments
- **Import/Export**: Bulk data operations and templates

### Timetable Generation
1. Configure generation parameters (academic year, optimization strategy)
2. Review data completeness (programs, faculty, classrooms)
3. Start generation process with real-time progress tracking
4. Review results and resolve any conflicts
5. Export final timetables in multiple formats

### AI Assistant
- Get optimization suggestions during timetable generation
- Receive alerts about potential conflicts or issues
- Access performance analytics and recommendations
- View system health and utilization metrics

## 🏗️ Architecture

### Frontend-Only Demo Structure
```
nexus/
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Admin dashboard pages
│   ├── faculty/           # Faculty management interface
│   ├── student/           # Student dashboard
│   └── (other routes)/    # Demo pages and authentication
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components (Radix UI based)
│   ├── auth/             # Mock authentication components
│   └── (feature-specific)/ # Timetable, faculty, student components
├── lib/                   # Demo business logic
│   ├── timetable-engine/  # Simulated optimization algorithms
│   ├── auth/              # Mock authentication service
│   └── utils/             # Helper functions and types
├── data/                  # Mock datasets
│   ├── sampleData.ts      # Teachers, courses, rooms data
│   └── timetableData.ts   # Generated timetable samples
└── styles/                # Global styles and Tailwind config
```

### Demo Data Flow
1. **Input**: Pre-loaded mock data (programs, faculty, students, constraints)
2. **Processing**: Simulated AI optimization with loading animations
3. **Output**: Interactive timetable with realistic sample schedules
4. **Storage**: Browser memory and local state management
5. **Presentation**: Fully responsive React components with real-time UI updates

## 🔧 Development

### Available Scripts
```bash
# Start development server
pnpm dev          # Runs on http://localhost:3000

# Build for production
pnpm build        # Creates optimized static build

# Start production server
pnpm start        # Serves the built application

# Lint and type checking
pnpm lint         # ESLint and TypeScript validation
```

### Demo Development
- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety with mock data interfaces
- **Component Library**: Pre-built UI components for rapid iteration
- **Mock Services**: Realistic data simulation without backend complexity
- **Static Export**: Ready for deployment to any static hosting platform

## 🚀 Deployment

### Static Hosting Platforms
This frontend-only demo can be deployed to any static hosting service:

**Vercel (Recommended)**
```bash
# Connect your GitHub repository to Vercel
# Automatic deployments on every push
# Zero configuration needed
```

**Netlify**
```bash
# Build command: pnpm build
# Publish directory: out
# Zero configuration needed
```

**GitHub Pages**
```bash
# Enable static export in next.config.mjs
# Deploy from /out directory
```

### Production Features
- **Static Generation**: All pages pre-rendered at build time
- **Performance**: Optimized bundle size and loading speed
- **SEO Ready**: Meta tags and structured data included
- **Mobile Optimized**: Responsive design for all devices
- **Solver**: Distributed computing for large datasets
- **Frontend**: CDN, static asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure responsive design compatibility
- Maintain accessibility standards

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](./docs/)  
- **Issues**: [GitHub Issues](https://github.com/your-org/nexus/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/nexus/discussions)
- **Email**: support@nexus-timetable.com

## 🙏 Acknowledgments

- **OR-Tools**: Google's optimization toolkit inspiration
- **NEP 2020**: National Education Policy guidelines
- **shadcn/ui**: Beautiful component library
- **Vercel**: Deployment platform and Next.js team
- **Prisma**: Database toolkit and ORM

---

**Built with ❤️ for modern educational institutions**