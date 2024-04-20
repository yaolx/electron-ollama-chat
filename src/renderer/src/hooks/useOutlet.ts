import { useOutletContext } from 'react-router-dom'

type ContextType = { url: string }

export default function useOutlet() {
  return useOutletContext<ContextType>()
}
