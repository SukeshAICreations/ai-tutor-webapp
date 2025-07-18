'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

interface ChatResponse {
  content: string
  sessionId?: string
  audioUrl?: string
  hasImage?: boolean
}

export function useChat() {
  const { user } = useAuth()
  const [isSpeaking, setIsSpeaking] = useState(false)

  const sendMessage = useCallback(async (message: string, sessionId?: string | null): Promise<ChatResponse> => {
    try {
      // Create or get session
      let currentSessionId = sessionId
      
      if (!currentSessionId && user) {
        const { data: session, error: sessionError } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
            language: 'en',
          })
          .select()
          .single()

        if (sessionError) {
          console.error('Error creating session:', sessionError)
        } else {
          currentSessionId = session.id
        }
      }

      // Save user message
      if (currentSessionId && user) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: currentSessionId,
            role: 'user',
            content: message,
          })
      }

      // Call AI service (OpenRouter with free LLM)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId: currentSessionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      // Save assistant message
      if (currentSessionId && user) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: currentSessionId,
            role: 'assistant',
            content: data.content,
          })
      }

      return {
        content: data.content,
        sessionId: currentSessionId,
        hasImage: data.hasImage || false,
      }
    } catch (error) {
      console.error('Error in sendMessage:', error)
      throw error
    }
  }, [user])

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  return {
    sendMessage,
    speakText,
    stopSpeaking,
    isSpeaking,
  }
}