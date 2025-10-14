import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import { useWallet } from '@demox-labs/miden-wallet-adapter-react'
import { useBalance } from '@/hooks/useBalance'
import { useMidenClient } from '@/contexts/MidenClientContext'
import { bech32ToAccountId } from '@/lib/midenClient'
import { formatBalance } from '@/lib/utils'
import { createFaucet } from '@/lib/createFaucet'

interface PricingCardProps {
  domain: string
  years: number | string
  termsAccepted: boolean
  onTermsChange: (checked: boolean) => void
}

// Calculate price per year based on domain length
const getDomainLengthMultiplier = (length: number): number => {
  switch (length) {
    case 1: return 5
    case 2: return 4
    case 3: return 3
    case 4: return 2
    default: return 1 // 5 characters and more
  }
}

// new faucet id = 0x508ade02b85a6220218f85140adf52

// Constants
const MIDEN_FAUCET_ID_BECH32 = "mtst1qzp4jgq9cy75wgp7c833ynr9f4cqzraplt4"
const BASE_PRICE_PER_YEAR = 5

export function PricingCard({ domain, years, termsAccepted, onTermsChange }: PricingCardProps) {
  const { accountId: rawAccountId, connected } = useWallet()
  const [isCreatingFaucet, setIsCreatingFaucet] = useState(false)
  const [faucetError, setFaucetError] = useState<string | null>(null)

  const accountId = useMemo(() => {
    if (rawAccountId != null) {
      return bech32ToAccountId(rawAccountId);
    } else return undefined;
  }, [rawAccountId]);

  const { client } = useMidenClient();

  const faucetId = useMemo(() =>
    bech32ToAccountId(MIDEN_FAUCET_ID_BECH32),
    []
  );

  const lengthMultiplier = useMemo(() =>
    getDomainLengthMultiplier(domain.length),
    [domain.length]
  );

  const numericYears = useMemo(() =>
    typeof years === 'string' ? parseInt(years) || 1 : years,
    [years]
  );

  const pricePerYear = useMemo(() =>
    BASE_PRICE_PER_YEAR * lengthMultiplier,
    [lengthMultiplier]
  );

  const pricePerYearFixed = useMemo(() =>
    pricePerYear.toFixed(2),
    [pricePerYear]
  );

  const totalPrice = useMemo(() =>
    (pricePerYear * numericYears).toFixed(2),
    [pricePerYear, numericYears]
  );


  const handleTermsChange = (checked: boolean) => {
    onTermsChange(checked)
  }

  const midenBalance = useBalance({
    accountId,
    faucetId,
    client,
  });

  const handleCreateFaucet = async () => {
    if (!connected || !rawAccountId) {
      setFaucetError("Please connect your wallet first");
      alert("❌ Please connect your wallet first");
      return;
    }

    setIsCreatingFaucet(true);
    setFaucetError(null);

    try {
      const result = await createFaucet(rawAccountId, "REG");
      console.log("Faucet creation complete:", result);
      alert(`✅ Success!\nFaucet ID: ${result.faucetId}\nTransaction ID: ${result.txId}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setFaucetError(errorMsg);
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setIsCreatingFaucet(false);
    }
  };

  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Pricing Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Your Miden Balance:</span>
          <span className="font-medium">{formatBalance(midenBalance || BigInt(0))} MIDEN</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Price per year:</span>
          <span className="font-medium">{pricePerYearFixed} MIDEN</span>
        </div>
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total Price:</span>
          <span>{totalPrice} MIDEN</span>
        </div>

        <div className="border-t pt-4">
          <Button
            onClick={handleCreateFaucet}
            disabled={isCreatingFaucet || !connected}
            className="w-full"
            variant="outline"
          >
            {isCreatingFaucet ? "Creating Faucet..." : "Create Test Faucet & Receive Tokens"}
          </Button>
          {faucetError && (
            <p className="text-sm text-red-500 mt-2">Error: {faucetError}</p>
          )}
        </div>

        <div className="border-t pt-4 space-y-4">

          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={handleTermsChange}
            />
            <div className="flex-1 flex items-start justify-between">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                I have read and accept the Terms and Conditions
              </label>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-2"
                      type="button"
                    >
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>
                      By checking this box, you agree to our terms of service and privacy policy.
                      You acknowledge that you understand the domain registration process and associated costs.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}