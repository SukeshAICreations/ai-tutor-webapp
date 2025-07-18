'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Calculator,
  Atom,
  Globe,
  BookOpen,
  Code,
  Brain,
  Palette,
  Music,
  Heart,
  Briefcase,
  Search,
  ArrowRight,
  Star,
  Clock,
  Users
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from 'react-i18next'

const subjects = [
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Algebra, Calculus, Geometry, Statistics',
    icon: Calculator,
    color: 'bg-blue-500',
    difficulty: 'All Levels',
    duration: '30-60 min',
    students: '2.5k',
    topics: ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry']
  },
  {
    id: 'science',
    title: 'Science',
    description: 'Physics, Chemistry, Biology, Earth Science',
    icon: Atom,
    color: 'bg-green-500',
    difficulty: 'Beginner to Advanced',
    duration: '45-90 min',
    students: '1.8k',
    topics: ['Physics', 'Chemistry', 'Biology', 'Earth Science', 'Astronomy']
  },
  {
    id: 'languages',
    title: 'Languages',
    description: 'English, Spanish, French, Mandarin, Arabic',
    icon: Globe,
    color: 'bg-purple-500',
    difficulty: 'All Levels',
    duration: '20-45 min',
    students: '3.2k',
    topics: ['Grammar', 'Vocabulary', 'Conversation', 'Writing', 'Literature']
  },
  {
    id: 'history',
    title: 'History',
    description: 'World History, Ancient Civilizations, Modern Era',
    icon: BookOpen,
    color: 'bg-orange-500',
    difficulty: 'Beginner to Intermediate',
    duration: '30-60 min',
    students: '1.2k',
    topics: ['Ancient History', 'Medieval', 'Modern History', 'World Wars', 'Civilizations']
  },
  {
    id: 'coding',
    title: 'Programming',
    description: 'Python, JavaScript, Web Development, AI/ML',
    icon: Code,
    color: 'bg-indigo-500',
    difficulty: 'Beginner to Expert',
    duration: '60-120 min',
    students: '4.1k',
    topics: ['Python', 'JavaScript', 'React', 'AI/ML', 'Data Structures']
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    description: 'Machine Learning, Deep Learning, Neural Networks',
    icon: Brain,
    color: 'bg-pink-500',
    difficulty: 'Intermediate to Advanced',
    duration: '90-180 min',
    students: '890',
    topics: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Ethics']
  },
  {
    id: 'arts',
    title: 'Arts & Design',
    description: 'Visual Arts, Digital Design, Art History',
    icon: Palette,
    color: 'bg-red-500',
    difficulty: 'All Levels',
    duration: '45-90 min',
    students: '1.5k',
    topics: ['Drawing', 'Digital Art', 'Design Theory', 'Art History', 'Photography']
  },
  {
    id: 'music',
    title: 'Music',
    description: 'Music Theory, Instruments, Composition',
    icon: Music,
    color: 'bg-yellow-500',
    difficulty: 'Beginner to Advanced',
    duration: '30-60 min',
    students: '980',
    topics: ['Music Theory', 'Piano', 'Guitar', 'Composition', 'Music History']
  },
  {
    id: 'health',
    title: 'Health & Medicine',
    description: 'Anatomy, Physiology, Health Sciences',
    icon: Heart,
    color: 'bg-teal-500',
    difficulty: 'Intermediate to Advanced',
    duration: '60-120 min',
    students: '750',
    topics: ['Anatomy', 'Physiology', 'Medicine', 'Nutrition', 'Mental Health']
  },
  {
    id: 'business',
    title: 'Business & Economics',
    description: 'Economics, Finance, Marketing, Management',
    icon: Briefcase,
    color: 'bg-gray-600',
    difficulty: 'Beginner to Advanced',
    duration: '45-90 min',
    students: '1.3k',
    topics: ['Economics', 'Finance', 'Marketing', 'Management', 'Entrepreneurship']
  }
]

export default function SubjectsPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  const filteredSubjects = subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSubjectSelect = (subjectId: string) => {
    // Navigate to AI Tutor with subject context
    router.push(`/ai-tutor?subject=${subjectId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Explore Subjects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of subjects and start learning with AI-powered tutoring
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search subjects or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={() => handleSubjectSelect(subject.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${subject.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <subject.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl mb-2">{subject.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {subject.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {subject.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {subject.students}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs">
                      {subject.difficulty}
                    </Badge>
                  </div>

                  {/* Topics */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Topics covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {subject.topics.slice(0, 3).map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {subject.topics.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{subject.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full group-hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSubjectSelect(subject.id)
                    }}
                  >
                    Start Learning
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredSubjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No subjects found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse all available subjects
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 p-8 bg-white rounded-2xl shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
          <p className="text-gray-600 mb-6">
            Our AI tutor can help with any topic! Just ask a question and start learning.
          </p>
          <Button 
            size="lg"
            onClick={() => router.push('/ai-tutor')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Brain className="w-5 h-5 mr-2" />
            Ask AI Tutor Anything
          </Button>
        </motion.div>
      </div>
    </div>
  )
}