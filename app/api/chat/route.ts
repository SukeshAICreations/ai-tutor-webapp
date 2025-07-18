import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenRouter client (compatible with OpenAI SDK)
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Create system prompt for AI tutor
    const systemPrompt = `You are an AI tutor designed to help students learn across all subjects. You should:

1. Provide clear, educational explanations
2. Break down complex topics into understandable parts
3. Use examples and analogies when helpful
4. Encourage critical thinking with follow-up questions
5. Adapt your language to be appropriate for the student's level
6. Be patient, supportive, and encouraging
7. If asked about code, provide working examples with explanations
8. For math problems, show step-by-step solutions
9. For languages, provide pronunciation guides and cultural context
10. Always aim to teach, not just answer

Keep responses concise but comprehensive. If the topic is very complex, offer to break it down further.`

    // Call OpenRouter API with a free model
    const completion = await openai.chat.completions.create({
      model: 'microsoft/wizardlm-2-8x22b', // Free model on OpenRouter
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.'

    // Check if response contains code or images
    const hasCode = aiResponse.includes('```') || aiResponse.includes('function') || aiResponse.includes('class ')
    const hasImage = aiResponse.toLowerCase().includes('image') || aiResponse.toLowerCase().includes('diagram')

    return NextResponse.json({
      content: aiResponse,
      hasCode,
      hasImage,
      sessionId,
    })

  } catch (error) {
    console.error('Error in chat API:', error)
    
    // Fallback response if API fails
    const fallbackResponse = `I'm experiencing some technical difficulties right now. Here's what I can tell you about your question:

If you're asking about a specific subject, I'd be happy to help once my connection is restored. In the meantime, you might want to:

1. Break down your question into smaller parts
2. Look for reliable educational resources online
3. Try rephrasing your question
4. Check if there are any specific terms you'd like me to explain

Please try asking your question again in a moment!`

    return NextResponse.json({
      content: fallbackResponse,
      hasCode: false,
      hasImage: false,
      sessionId,
    })
  }
}