import { createContext, useContext, useEffect, useState, useRef, useMemo, type ReactNode } from 'react'
import { type WebClient, TransactionProver } from '@demox-labs/miden-sdk'
import { instantiateClient, bech32ToAccountId } from '@/lib/midenClient'
import { useWallet } from '@demox-labs/miden-wallet-adapter-react'

const PROVER_URL = "https://tx-prover.testnet.miden.io"

interface MidenClientContextValue {
  client: WebClient | undefined
  prover: TransactionProver | null
  isLoading: boolean
}

const MidenClientContext = createContext<MidenClientContextValue | undefined>(undefined)

export function MidenClientProvider({ children }: { children: ReactNode }) {
  const { accountId: rawAccountId } = useWallet()
  const [client, setClient] = useState<WebClient | undefined>(undefined)
  const [prover, setProver] = useState<TransactionProver | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isInitializing = useRef(false)

  const accountId = useMemo(() => {
    if (rawAccountId != null) {
      return bech32ToAccountId(rawAccountId)
    }
    return undefined
  }, [rawAccountId])

  useEffect(() => {
    if (!isInitializing.current && client == null && accountId != null) {
      isInitializing.current = true
      setIsLoading(true);
      (async () => {
        try {
          const newClient = await instantiateClient({
            accountsToImport: [accountId],
          })
          const newProver = TransactionProver.newRemoteProver(PROVER_URL)
          setClient(newClient)
          setProver(newProver)
        } catch (error) {
          console.error('Failed to initialize client/prover:', error)
          isInitializing.current = false
        } finally {
          setIsLoading(false)
        }
      })()
    }
  }, [accountId, client])

  return (
    <MidenClientContext.Provider value={{ client, prover, isLoading }}>
      {children}
    </MidenClientContext.Provider>
  )
}

export function useMidenClient() {
  const context = useContext(MidenClientContext)
  if (context === undefined) {
    throw new Error('useMidenClient must be used within MidenClientProvider')
  }
  return context
}
