# 🤖 AI Tutor WebApp

A comprehensive AI-powered multilingual tutoring platform built with Next.js, Supabase, and open-source tools. Experience the future of education with voice interaction, document analysis, and personalized learning paths.

![AI Tutor WebApp](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop)

## ✨ Features

### 🧠 Core Features
- **AI-Powered Tutoring**: Get instant answers with GPT-based AI using free LLMs via OpenRouter
- **Voice Interaction**: Speak your questions and hear AI responses with Web Speech API
- **Multilingual Support**: 15+ languages with auto-translation and locale detection
- **Document Analysis**: Upload PDFs, DOCs, images and get AI explanations
- **Real-time Chat**: Persistent chat sessions with voice and text
- **Subject Categories**: Math, Science, Languages, History, Coding, AI, Arts, and more

### 👥 User Management
- **Google OAuth**: Secure authentication via Supabase
- **Role-based Access**: Student, Teacher, and Admin roles
- **Profile Management**: Customizable user profiles with preferences
- **Learning Analytics**: Track progress, time spent, and favorite subjects

### 📚 Learning Tools
- **Interactive Subjects**: Browse and learn from categorized topics
- **Document Library**: Searchable knowledge base with AI-curated content
- **Progress Tracking**: Visual analytics and learning streaks
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Framer Motion** - Smooth animations
- **react-i18next** - Internationalization

### Backend & Database
- **Supabase** - Backend-as-a-Service (Auth, Database, Storage, Realtime)
- **PostgreSQL** - Robust relational database
- **Row Level Security** - Secure data access

### AI & Voice
- **OpenRouter** - Access to free LLMs (Mixtral, Claude, etc.)
- **LangChain** - AI application framework
- **Web Speech API** - Voice recognition and synthesis
- **react-speech-recognition** - Voice input handling

### Deployment
- **Vercel** - Frontend hosting (free tier)
- **Supabase** - Backend infrastructure
- **GitHub Actions** - CI/CD pipeline

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Supabase account (free)
- OpenRouter account (free)

### 1. Clone the Repository
```bash
git clone https://github.com/SukeshAICreations/ai-tutor-webapp.git
cd ai-tutor-webapp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your keys
3. Run the database migration:
   ```bash
   # Copy the SQL from supabase/migrations/001_initial_schema.sql
   # and run it in your Supabase SQL editor
   ```
4. Enable Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your domain to redirect URLs

### 4. Set Up OpenRouter

1. Sign up at [openrouter.ai](https://openrouter.ai) (free)
2. Get your API key from the dashboard
3. Choose a free model (e.g., microsoft/wizardlm-2-8x22b)

### 5. Environment Variables

Create a `.env.local` file:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenRouter API Key (for free LLM access)
OPENROUTER_API_KEY=your_openrouter_api_key

# Optional: Custom TTS/STT endpoints
WHISPER_API_URL=http://localhost:8000/transcribe
TTS_API_URL=http://localhost:8001/synthesize
```

### 6. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 📁 Project Structure

```
ai-tutor-webapp/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── ai-tutor/         # Main AI chat interface
│   ├── subjects/         # Subject categories
│   ├── upload/           # Document upload
│   ├── library/          # Knowledge base
│   ├── analytics/        # Learning analytics
│   └── settings/         # User settings
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   ├── voice/            # Voice interaction
│   └── chat/             # Chat components
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase client & types
│   ├── langchain/        # AI integration
│   └── utils/            # Helper functions
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication
│   ├── useVoice.ts       # Voice recognition
│   └── useChat.ts        # Chat functionality
├── i18n/                 # Internationalization
│   ├── config.ts         # i18n configuration
│   └── locales/          # Translation files
├── supabase/             # Database migrations
└── public/               # Static assets
```

## 🌍 Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- Arabic (ar)
- Chinese (zh)
- Swahili (sw)
- Portuguese (pt)
- German (de)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Hindi (hi)
- Russian (ru)
- Dutch (nl)
- Swedish (sv)

## 🎯 Usage Examples

### Basic AI Tutoring
```
User: "Explain photosynthesis"
AI: "Photosynthesis is the process by which plants convert sunlight into energy..."
```

### Voice Interaction
1. Click the microphone button
2. Speak your question
3. Get both text and voice responses

### Document Analysis
1. Upload a PDF or document
2. Ask questions about the content
3. Get detailed explanations and summaries

### Subject Learning
1. Browse subjects (Math, Science, etc.)
2. Select a topic
3. Start interactive learning session

## 🔧 Configuration

### Customizing AI Responses
Edit `app/api/chat/route.ts` to modify the system prompt:
```typescript
const systemPrompt = `You are an AI tutor designed to help students learn...`
```

### Adding New Languages
1. Create translation file in `i18n/locales/`
2. Add to `i18n/config.ts`
3. Update language selector component

### Voice Settings
Modify voice recognition settings in `hooks/useVoice.ts`:
```typescript
recognitionInstance.lang = 'en-US' // Change language
recognitionInstance.continuous = true // Continuous listening
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Configure environment variables

### Deploy to Railway

1. Connect your GitHub repo
2. Set environment variables
3. Deploy with automatic builds

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend infrastructure
- [OpenRouter](https://openrouter.ai/) - Free LLM access
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

## 📞 Support

- 📧 Email: support@aitutorapp.com
- 💬 Discord: [Join our community](https://discord.gg/aitutorapp)
- 🐛 Issues: [GitHub Issues](https://github.com/SukeshAICreations/ai-tutor-webapp/issues)
- 📖 Docs: [Documentation](https://docs.aitutorapp.com)

## 🗺️ Roadmap

- [ ] **Video Learning Integration** - YouTube API integration
- [ ] **Real-time Collaboration** - Multi-user sessions
- [ ] **Advanced Analytics** - Detailed learning insights
- [ ] **Mobile App** - React Native version
- [ ] **Offline Mode** - PWA capabilities
- [ ] **Teacher Dashboard** - Assignment management
- [ ] **Gamification** - Badges and achievements
- [ ] **API Access** - Public API for developers

---

**Built with ❤️ by [SukeshAICreations](https://github.com/SukeshAICreations)**

⭐ Star this repo if you find it helpful!