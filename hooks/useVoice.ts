'use client'

import { useState, useEffect, useCallback } from 'react'

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function useVoice() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onstart = () => {
        setIsListening(true)
      }

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript)
        }
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    } else {
      setIsSupported(false)
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setTranscript('')
      recognition.start()
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }, [recognition, isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}