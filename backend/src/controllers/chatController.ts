import { Request, Response } from 'express'
import { AIService } from '../services/aiService'

export const chatHandler = async (req: Request, res: Response) => {
  try {
    const { messages, workspaceFiles, apiKey, model } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' })
    }

    // AIService resolves: request-level apiKey > env GEMINI_API_KEY > throws error
    const aiService = new AIService(apiKey || undefined)

    const reply = await aiService.chat(messages, workspaceFiles || {}, model)

    res.status(200).json({ reply })
  } catch (err: any) {
    console.error('[ChatHandler] Error:', err.message || err)
    res.status(500).json({ error: err.message || 'Failed to process chat request' })
  }
}
