import { HumanMessage, AIMessage } from '@langchain/core/messages'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever'
import { createRetrievalChain } from 'langchain/chains/retrieval'

import chatModel from './ollama'
import { initVectorStore } from './vector'

let retrievalChain

async function getChain() {
  if (!retrievalChain) {
    const prompt = ChatPromptTemplate.fromTemplate(`使用以下上下文来回答最后的问题。如果你不知道答案，就说你不知道，不要试图编造答
    案。最多使用三句话。尽量使答案简明扼要。总是在回答的最后说“谢谢你的提问！”。
    {context}
    问题: {input}
    `)
    // 加载模型
    const documentChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt
    })
    const retriever = await initVectorStore()
    retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever
    })
  }

  return retrievalChain
}

// 知识库问答
export async function stuffOocumentsChain(id, content, fn) {
  const retrievalChain = await getChain()
  const result = await retrievalChain.stream({
    input: content
  })
  for await (const part of result) {
    if (part.answer) {
      fn(id, part.answer)
    }
  }
}
// 根据聊天记录和知识库进行回答
export async function historyChain(content) {
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder('chat_history'),
    ['user', '{input}'],
    ['user', 'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation']
  ])
  const retriever = await initVectorStore()
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: chatModel,
    retriever,
    rephrasePrompt: historyAwarePrompt
  })
  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    ['system', "Answer the user's questions based on the below context:\n\n{context}"],
    new MessagesPlaceholder('chat_history'),
    ['user', '{input}']
  ])

  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt: historyAwareRetrievalPrompt
  })

  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain
  })

  const result = await conversationalRetrievalChain.invoke({
    chat_history: [new HumanMessage("china's area?"), new AIMessage('960!')],
    input: content
  })
  console.log('####result', result)
  return result
}
