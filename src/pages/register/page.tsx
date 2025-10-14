import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useWallet } from '@demox-labs/miden-wallet-adapter'
import { Button } from '@/components/ui/button'
import { PricingCard } from './components/pricing-card'
import { DomainDetailsCard } from './components/domain-details-card'
import { Faq } from './components/faq'
import { WalletMultiButton } from '@demox-labs/miden-wallet-adapter'
import { registerName } from '@/lib/registerName'
import { bech32ToAccountId } from '@/lib/midenClient'
import { AccountId } from '@demox-labs/miden-sdk'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Wallet, AlertTriangle } from 'lucide-react'
import { incrementCounterContract } from '@/lib/counterContract'

export default function Register() {
  const [searchParams] = useSearchParams()
  const domain = searchParams.get('domain') || ''
  const [years, setYears] = useState<number | string>(1)
  const [showYearsTooltip, setShowYearsTooltip] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [emptyInputTimer, setEmptyInputTimer] = useState<number | null>(null)
  const [transactionSubmitted, setTransactionSubmitted] = useState(false)
  const [transactionFailed, setTransactionFailed] = useState(false)
  const { connected, requestTransaction, accountId: rawAccountId } = useWallet()

  const faucetId = useMemo(() =>
    AccountId.fromHex("0x300d81593c4e7e2054c497c114b9e5"),
    []
  );

  const destinationAccountId = useMemo(() =>
    AccountId.fromHex("0x1db18ab7c49dfa006b6bcfdaa8cdad"),
    []
  );

  const accountId = useMemo(() => {
    if (rawAccountId != null) {
      return bech32ToAccountId(rawAccountId);
    } else return undefined;
  }, [rawAccountId]);

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Clear any existing empty input timer
    if (emptyInputTimer) {
      clearTimeout(emptyInputTimer)
      setEmptyInputTimer(null)
    }

    // Allow empty input for better user experience
    if (inputValue === '') {
      setYears('')
      setShowYearsTooltip(false)

      // Set timer to reset to 1 after 3 seconds of empty input
      const timer = setTimeout(() => {
        setYears(1)
        setEmptyInputTimer(null)
      }, 3000)

      setEmptyInputTimer(timer)
      return
    }

    const value = parseInt(inputValue)

    // Handle invalid input (NaN)
    if (isNaN(value)) {
      return
    }

    if (value > 10) {
      setShowYearsTooltip(true)
      setYears(10) // Cap at 10
    } else if (value < 1) {
      setYears(1) // Minimum 1 year
    } else {
      setYears(value)
      setShowYearsTooltip(false)
    }
  }

  // Hide tooltip after 3 seconds
  useEffect(() => {
    if (showYearsTooltip) {
      const timer = setTimeout(() => {
        setShowYearsTooltip(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showYearsTooltip])

  // Cleanup empty input timer on component unmount
  useEffect(() => {
    return () => {
      if (emptyInputTimer) {
        clearTimeout(emptyInputTimer)
      }
    }
  }, [emptyInputTimer])

  const handlePurchase = async () => {
    if (connected && accountId && requestTransaction) {
      // Reset previous states
      setTransactionSubmitted(false)
      setTransactionFailed(false)

      try {
        await registerName({
          senderAccountId: accountId,
          destinationAccountId: destinationAccountId,
          faucetId: faucetId,
          amount: BigInt(10000000), //pricing-card.tsx den total price çek
          domain: domain,
          requestTransaction: requestTransaction,
        })
        // Reset terms and show wallet prompt
        setTermsAccepted(false)
        setTransactionSubmitted(true)
      } catch (error) {
        console.error("Registration failed:", error)
        setTransactionFailed(true)
      }
    }
  }


  return (
    <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl text-center py-5">
        <div className="space-y-2 mb-6 ">
          <h1 className="luckiest-guy-regular text-2xl sm:text-3xl md:text-4xl font-bold md:tracking-tight">
            Register {domain}.miden
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg px-2">
            Complete your Miden identity registration to claim this domain.
          </p>
        </div>

        <div className="w-full space-y-4 ">
          <DomainDetailsCard
            domain={domain}
            years={years}
            showYearsTooltip={showYearsTooltip}
            onYearsChange={handleYearsChange}
          />

          {!connected ? (
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          ) : (
            <div className="space-y-4">
              {transactionSubmitted && (
                <Alert className="border-[#FF9A00] bg-[#FF9A00]/10">
                  <Wallet className="h-5 w-5 text-[#FF9A00]" />
                  <AlertTitle className="text-[#FF9A00] font-semibold">Transaction Submitted</AlertTitle>
                  <AlertDescription className="text-foreground">
                    Please open your Miden wallet to consume the transaction and complete your domain registration.
                  </AlertDescription>
                </Alert>
              )}
              {transactionFailed && (
                <Alert className="border-destructive bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <AlertTitle className="text-destructive font-semibold">Transaction Failed</AlertTitle>
                  <AlertDescription className="text-foreground">
                    Transaction could not be created. Please contact the project owners for assistance.
                  </AlertDescription>
                </Alert>
              )}
              <PricingCard
                domain={domain}
                years={years}
                termsAccepted={termsAccepted}
                onTermsChange={setTermsAccepted}
              />
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handlePurchase}
                  disabled={!termsAccepted}
                  className="px-8 py-2 text-lg font-semibold bg-[#FF9A00]"
                  size="lg"
                >
                  Purchase
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="my-12">
          <Faq />
        </div>
      </div>
    </main>
  )
}