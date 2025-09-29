# AI Timetable Generation System (Nexus)

A comprehensive, intelligent timetable generation system built with Next.js 14, featuring AI-powered optimization, real-time conflict resolution, and NEP 2020 compliance.

## 🚀 Features

### Core Functionality
- **Intelligent Timetable Generation**: Advanced CP-SAT solver with hybrid optimization
- **Real-time Conflict Detection**: Automatic identification and resolution of scheduling conflicts
- **NEP 2020 Compliance**: Support for flexible credit systems and multidisciplinary courses
- **Multi-constraint Optimization**: Faculty availability, room capacity, lab requirements, and more

### AI-Powered Features
- **Smart Suggestions**: AI assistant provides optimization recommendations
- **Predictive Analytics**: Performance metrics and utilization forecasting
- **Automated Rescheduling**: Intelligent handling of disruptions and changes
- **Learning Algorithms**: Continuous improvement based on usage patterns

### User Experience
- **Intuitive Dashboard**: Clean, modern interface built with shadcn/ui
- **Real-time Updates**: Live progress tracking and instant feedback
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Customizable theme preferences

### Data Management
- **Import/Export**: CSV and Excel file support for bulk data operations
- **Database Integration**: PostgreSQL with Prisma ORM for robust data handling
- **Backup & Recovery**: Automated data protection and version control
- **Analytics Dashboard**: Comprehensive reporting and insights

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **React Hook Form** - Form management
- **Lucide Icons** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database toolkit and query builder
- **PostgreSQL** - Primary database
- **CP-SAT Solver** - Constraint programming for optimization

### DevOps & Deployment
- **Docker** - Containerization and deployment
- **Docker Compose** - Multi-service orchestration
- **Vercel** - Cloud deployment platform
- **GitHub Actions** - CI/CD pipeline

## 📦 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Docker and Docker Compose (for full stack)
- PostgreSQL (if running locally)

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd nexus
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other settings
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations (requires PostgreSQL)
   npm run db:migrate
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Access the application at http://localhost:3000

### Docker Deployment

1. **Full Stack with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access Services**
   - **Application**: http://localhost:3000
   - **Database Admin**: http://localhost:8080
   - **PostgreSQL**: localhost:5432

See [DOCKER.md](./DOCKER.md) for detailed deployment instructions.

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

### Component Structure
```
nexus/
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API endpoints
│   └── (other routes)/    # Public pages
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   └── (feature-specific)/
├── lib/                   # Core business logic
│   ├── timetable-engine/  # CP-SAT solver and optimization
│   ├── database/          # Database service and utilities
│   ├── auth/              # Authentication logic
│   └── utils/             # Helper functions
├── prisma/                # Database schema and migrations
├── scripts/               # Database initialization scripts
└── styles/                # Global styles and themes
```

### Data Flow
1. **Input**: Programs, faculty, students, and constraints
2. **Processing**: CP-SAT solver with hybrid optimization
3. **Output**: Optimized timetable with conflict resolution
4. **Storage**: PostgreSQL database with Prisma ORM
5. **Presentation**: React components with real-time updates

## 🔧 Development

### Database Operations
```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Reset database to initial state
npm run db:reset

# Open Prisma Studio for data management
npm run db:studio

# Seed database with sample data
npm run db:seed
```

### Code Quality
```bash
# Type checking
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

### Testing Strategy
- **Unit Tests**: Core solver algorithms and utilities
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: User workflows and critical paths
- **Performance Tests**: Solver optimization and scalability

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Performance optimization enabled

### Scaling Considerations
- **Database**: Connection pooling, read replicas
- **API**: Rate limiting, caching strategies
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