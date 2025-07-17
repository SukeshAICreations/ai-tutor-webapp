'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Brain, 
  Mic, 
  Globe, 
  Users, 
  BarChart3, 
  Upload, 
  Video,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Play
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from 'react-i18next'

const features = [
  {
    icon: Brain,
    title: 'AI Tutor',
    description: 'Get instant answers with voice and text interaction',
    color: 'bg-blue-500'
  },
  {
    icon: Globe,
    title: 'Multilingual',
    description: 'Support for 15+ languages with auto-translation',
    color: 'bg-green-500'
  },
  {
    icon: Mic,
    title: 'Voice Interaction',
    description: 'Speak your questions and hear AI responses',
    color: 'bg-purple-500'
  },
  {
    icon: Upload,
    title: 'Document Analysis',
    description: 'Upload PDFs, docs and get AI explanations',
    color: 'bg-orange-500'
  },
  {
    icon: Users,
    title: 'Teacher Dashboard',
    description: 'Manage students, assignments, and live sessions',
    color: 'bg-pink-500'
  },
  {
    icon: Video,
    title: 'Video Learning',
    description: 'Curated educational videos by subject',
    color: 'bg-red-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track learning progress and performance',
    color: 'bg-indigo-500'
  },
  {
    icon: BookOpen,
    title: 'Library',
    description: 'Searchable knowledge base and resources',
    color: 'bg-teal-500'
  }
]

export default function HomePage() {
  const { user, signInWithGoogle } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleGetStarted = async () => {
    if (user) {
      router.push('/dashboard')
    } else {
      setIsLoading(true)
      try {
        await signInWithGoogle()
      } catch (error) {
        console.error('Sign in error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <Sparkles className="w-4 h-4 mr-1" />
              AI-Powered Learning Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              AI Tutor WebApp
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the future of education with multilingual AI tutoring, 
              voice interaction, and personalized learning paths.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                ) : (
                  <Play className="w-5 h-5 mr-2" />
                )}
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/ai-tutor')}
                className="px-8 py-3 text-lg"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Try AI Tutor
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for modern, interactive learning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-bg text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students and teachers using AI-powered education
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Start Learning Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}