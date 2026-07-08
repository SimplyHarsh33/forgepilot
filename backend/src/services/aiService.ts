import { GoogleGenAI, Content } from '@google/genai'
import { config } from '../config/env'

export interface ChatMessage {
  role: 'user' | 'model'
  content: string
}

export class AIService {
  private client: GoogleGenAI

  constructor(apiKey?: string) {
    const resolvedKey = apiKey || config.GEMINI_API_KEY
    if (!resolvedKey) {
      throw new Error('A Gemini API key is required. Set GEMINI_API_KEY in your .env file or pass it in the request body.')
    }
    this.client = new GoogleGenAI({ apiKey: resolvedKey })
  }

  /**
   * Builds a system instruction prompt that includes workspace file context.
   */
  buildSystemPrompt(workspaceFiles: Record<string, any> = {}): string {
    const fileContext = Object.keys(workspaceFiles)
      .map((filePath) => {
        const file = workspaceFiles[filePath]
        if (file.isFolder) return null
        return `--- FILE: ${filePath} ---\n${file.content}`
      })
      .filter(Boolean)
      .join('\n\n')

    return `You are ForgePilot, an AI coding workspace assistant.
You help developers generate, edit, and manage files in their workspace.
${fileContext ? `Here are the files currently present in the workspace:\n${fileContext}\n` : ''}
Always respond to requests by creating or editing files as needed.
To perform file changes, write a JSON action block inside a \`\`\`json-workspace-action code block like this:
{
  "actions": [
    {
      "action": "create",
      "path": "src/components/MyNewComp.tsx",
      "content": "Full code file contents"
    },
    {
      "action": "modify",
      "path": "src/App.tsx",
      "content": "Entire updated code file contents"
    },
    {
      "action": "delete",
      "path": "src/components/Unused.tsx",
      "content": ""
    }
  ]
}
You can run multiple actions (creates, modifications, deletes) at once.
You MUST output full file contents in the content field. Do not truncate code.
Style code using beautiful tailwind colors matching our pastel theme (or soft custom light styling).
Beside the action block, explain your choices in a helpful, concise developer voice.`
  }

  /**
   * Converts our internal message format to Gemini's Content[] format.
   */
  private toGeminiHistory(messages: ChatMessage[]): Content[] {
    return messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }))
  }

  /**
   * Sends messages to Gemini and returns the text reply.
   */
  async chat(
    messages: ChatMessage[],
    workspaceFiles: Record<string, any> = {},
    modelName = 'gemini-2.0-flash'
  ): Promise<string> {
    const systemInstruction = this.buildSystemPrompt(workspaceFiles)

    // Separate the last user message from the conversation history
    const history = messages.slice(0, -1)
    const lastMessage = messages[messages.length - 1]

    if (!lastMessage) throw new Error('No message provided to send.')

    const geminiHistory = this.toGeminiHistory(
      // Filter to only user/model messages, ignoring any system messages passed from frontend
      history.filter((m) => m.role === 'user' || m.role === 'model')
    )

    const chatSession = this.client.chats.create({
      model: modelName,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
      history: geminiHistory,
    })

    const response = await chatSession.sendMessage({
      message: lastMessage.content,
    })

    const text = response.text
    if (!text) throw new Error('Gemini returned an empty response.')

    return text
  }
}
