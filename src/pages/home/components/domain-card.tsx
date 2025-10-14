import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

interface DomainCardProps {
  domain: string
}

export function DomainCard({ domain }: DomainCardProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [domainAvailable, setDomainAvailable] = useState(false)

  // Simulate domain availability check
  useEffect(() => {
    setLoading(true)
    const checkDomainAvailability = async () => {
      // Simulate an API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // For demonstration, let's assume domains with even length are available
      setDomainAvailable(domain.length % 2 === 0)
      setLoading(false)
    }
    checkDomainAvailability()
  }, [domain])


  const handleCardClick = useCallback(() => {
    if (!loading && domainAvailable) {
      navigate(`/register?domain=${encodeURIComponent(domain)}`)
    }
  }, [loading, domainAvailable, domain, navigate])

  return (
    <Card
      className="cursor-pointer hover:shadow transition-all duration-200 border hover:border-primary/50 bg-gray-50"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {domain}.miden
          </CardTitle>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : domainAvailable ? (
            <Badge variant="secondary" className="bg-green-200 text-green-800">
              Available
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-200 text-red-800">
              Unavailable
            </Badge>
          )}
        </div>
      </CardHeader>
    </Card>
  )
}