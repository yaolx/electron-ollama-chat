import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama'
import { FaissStore } from '@langchain/community/vectorstores/faiss'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

class Vector {
  private static instance

  constructor() {
    if (Vector.instance) {
      return Vector.instance
    }
    Vector.instance = null
  }

  static async getInstance() {
    if (!Vector.instance) {
      // 向量化配置
      const embeddings = new OllamaEmbeddings({
        model: 'nomic-embed-text',
        maxConcurrency: 5
      })
      // 加载html页面
      const loader = new DirectoryLoader('./asset/docs', {
        '.txt': (path: string) => new TextLoader(path)
      })
      const docs = await loader.load()
      // 分词
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20
      })
      const splitDocs = await splitter.splitDocuments(docs)
      // 存入向量数据库
      Vector.instance = await FaissStore.fromDocuments(splitDocs, embeddings)
    }
    return Vector.instance
  }
}

const instance = Vector.getInstance()
export default instance

export async function initVectorStore() {
  const vectorstore = await Vector.getInstance()
  // const resultOne = await vectorstore.similaritySearch('china', 1)
  //console.log('###resultOne', resultOne)
  const retriever = vectorstore.asRetriever({
    k: 3
  })
  return retriever
}
