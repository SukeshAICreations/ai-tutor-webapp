'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        setProfile(data)
      } else {
        // Create profile if it doesn't exist
        await createProfile(userId)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  const createProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) return

      const newProfile = {
        id: userId,
        email: user.email!,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        role: 'student' as const,
        language_preference: 'en',
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error in createProfile:', error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        console.error('Error signing in with Google:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in signInWithGoogle:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in signOut:', error)
      throw error
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        throw error
      }

      setProfile(data)
      return data
    } catch (error) {
      console.error('Error in updateProfile:', error)
      throw error
    }
  }

  return {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile,
  }
}