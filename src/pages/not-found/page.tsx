import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="luckiest-guy-regular text-6xl sm:text-7xl md:text-8xl font-bold text-muted-foreground">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg px-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="min-h-[120px]">
          {/* Spacer to prevent layout shift */}
        </div>
      </div>
    </main>
  )
}
