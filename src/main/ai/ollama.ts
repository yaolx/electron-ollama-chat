import { ChatOllama } from '@langchain/community/chat_models/ollama'

class Ollama {
  private static instance: ChatOllama | null = null

  constructor() {
    if (Ollama.instance) {
      return Ollama.instance
    }
    Ollama.instance = null
  }

  static getInstance() {
    if (!Ollama.instance) {
      Ollama.instance = new ChatOllama({
        baseUrl: 'http://localhost:11434',
        model: 'qwen:7b'
      })
    }
    return Ollama.instance
  }
}

const instance = Ollama.getInstance()

async function abort() {
  return instance.abort()
}

export default instance
