import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface DomainDetailsCardProps {
  domain: string
  years: number | string
  showYearsTooltip: boolean
  onYearsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function DomainDetailsCard({ domain, years, showYearsTooltip, onYearsChange }: DomainDetailsCardProps) {
  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Domain Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Domain:</span>
          <span className="font-medium">{domain}.miden</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Status:</span>
          <span className="text-green-600 font-medium">Available</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Years to register:</span>
          <TooltipProvider>
            <Tooltip open={showYearsTooltip}>
              <TooltipTrigger asChild>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={years}
                  onChange={onYearsChange}
                  className="w-20 text-center"
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-red-600 text-white">
                <p>Maximum 10 years of register available</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}