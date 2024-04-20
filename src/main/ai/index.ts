import { ipcMain } from 'electron'

import { stuffOocumentsChain, historyChain } from './chain'

export async function aiInit() {
  ipcMain.on('chat:send', async (_event, args) => {
    const { question, type, id, messages } = args
    switch (type) {
      case 'chat':
        const res1 = await historyChain(question)
        break
      case 'document':
        let answer = ''
        await stuffOocumentsChain(id, question, (id, reply) => {
          answer += reply
          _event.reply('chat:reply', {
            historyMessages: messages,
            reply: answer,
            id,
            question
          })
        })
        break
      default:
        break
    }
  })
}
