'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Eye,
  MessageSquare,
  Download
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase/client'
import { formatFileSize } from '@/lib/utils'

interface UploadedFile {
  id: string
  file: File
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  url?: string
  summary?: string
  error?: string
}

const acceptedFileTypes = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif']
}

export default function UploadPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      router.push('/')
      return
    }

    setIsUploading(true)

    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'uploading',
      progress: 0
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Process each file
    for (const uploadedFile of newFiles) {
      try {
        await processFile(uploadedFile)
      } catch (error) {
        console.error('Error processing file:', error)
        updateFileStatus(uploadedFile.id, 'error', 0, undefined, 'Failed to process file')
      }
    }

    setIsUploading(false)
  }, [user, router])

  const processFile = async (uploadedFile: UploadedFile) => {
    const { file } = uploadedFile

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        updateFileStatus(uploadedFile.id, 'uploading', progress)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user!.id}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      updateFileStatus(uploadedFile.id, 'processing', 100, publicUrl)

      // Save to database
      const { data: docData, error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user!.id,
          title: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          processed: false
        })
        .select()
        .single()

      if (dbError) {
        throw dbError
      }

      // Process document content (simulate AI analysis)
      const summary = await analyzeDocument(file, publicUrl)
      
      // Update database with summary
      await supabase
        .from('documents')
        .update({
          processed: true,
          content_summary: summary
        })
        .eq('id', docData.id)

      updateFileStatus(uploadedFile.id, 'completed', 100, publicUrl, summary)

    } catch (error) {
      console.error('Error in processFile:', error)
      updateFileStatus(uploadedFile.id, 'error', 0, undefined, 'Failed to process file')
    }
  }

  const analyzeDocument = async (file: File, url: string): Promise<string> => {
    // Simulate document analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const fileType = file.type
    let summary = ''

    if (fileType.includes('pdf')) {
      summary = `PDF document "${file.name}" has been analyzed. This appears to be an educational document with multiple sections covering various topics. The AI tutor can help explain concepts, answer questions about the content, and provide additional context.`
    } else if (fileType.includes('image')) {
      summary = `Image "${file.name}" has been processed. The AI tutor can describe what's shown in the image, explain any text or diagrams, and answer related questions.`
    } else if (fileType.includes('text') || fileType.includes('word')) {
      summary = `Text document "${file.name}" has been analyzed. The content includes educational material that the AI tutor can help explain, summarize, and expand upon with additional examples and explanations.`
    } else {
      summary = `Document "${file.name}" has been processed and is ready for AI analysis. Ask the tutor any questions about the content.`
    }

    return summary
  }

  const updateFileStatus = (
    id: string, 
    status: UploadedFile['status'], 
    progress: number, 
    url?: string, 
    summary?: string
  ) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === id 
        ? { ...file, status, progress, url, summary, error: status === 'error' ? summary : undefined }
        : file
    ))
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
  }

  const askAboutDocument = (file: UploadedFile) => {
    router.push(`/ai-tutor?document=${encodeURIComponent(file.file.name)}`)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Upload Documents</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">Please sign in to upload documents</p>
            <Button onClick={() => router.push('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-4">
            Upload Documents
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your documents, PDFs, images, or text files and let our AI tutor analyze and help you understand the content.
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-8">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                
                {isDragActive ? (
                  <p className="text-blue-600 font-medium">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-gray-700 font-medium mb-2">
                      Drag and drop files here, or click to select
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF
                    </p>
                    <p className="text-xs text-gray-400">
                      Maximum file size: 10MB
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Uploaded Files ({uploadedFiles.length})
                </CardTitle>
                <CardDescription>
                  Track the progress of your document uploads and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {file.file.type.includes('image') ? (
                              <ImageIcon className="w-5 h-5 text-blue-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{file.file.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(file.file.size)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {file.status === 'completed' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => askAboutDocument(file)}
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Ask AI
                              </Button>
                            </>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2 mb-2">
                        {file.status === 'uploading' && (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            <span className="text-sm text-blue-600">Uploading...</span>
                          </>
                        )}
                        {file.status === 'processing' && (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                            <span className="text-sm text-orange-600">Processing...</span>
                          </>
                        )}
                        {file.status === 'completed' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">Completed</span>
                          </>
                        )}
                        {file.status === 'error' && (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-600">Error</span>
                          </>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {(file.status === 'uploading' || file.status === 'processing') && (
                        <Progress value={file.progress} className="mb-3" />
                      )}

                      {/* Summary */}
                      {file.summary && file.status === 'completed' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800">{file.summary}</p>
                        </div>
                      )}

                      {/* Error */}
                      {file.error && file.status === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-800">{file.error}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Upload</h3>
                  <p className="text-sm text-gray-600">
                    Upload your documents, PDFs, images, or text files
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Loader2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Analyze</h3>
                  <p className="text-sm text-gray-600">
                    Our AI analyzes the content and extracts key information
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Learn</h3>
                  <p className="text-sm text-gray-600">
                    Ask questions about the content and get detailed explanations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}