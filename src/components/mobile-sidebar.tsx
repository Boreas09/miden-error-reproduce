import { Link } from 'react-router'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { WalletMultiButton } from '@demox-labs/miden-wallet-adapter'

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 md:hidden flex flex-col h-full p-0">
        <div className="p-6 pb-0">
          <SheetHeader className="text-left">
            <SheetTitle asChild>
              <SheetClose asChild>
                <Link
                  to="/"
                  className="text-lg font-bold md:tracking-tight luckiest-guy-regular text-2xl hover:text-primary transition-colors"
                >
                  Miden.name
                </Link>
              </SheetClose>
            </SheetTitle>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex flex-col mt-8 space-y-4">
            <SheetClose asChild>
              <Link
                to="/"
                className="text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-accent"
              >
                Home
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <a
                href="https://docs.miden.name/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-accent"
              >
                Docs
              </a>
            </SheetClose>
            <p className="cursor-pointer text-base font-medium py-2 px-3 rounded-md text-gray-400">Identity - Coming Soon</p>
          </nav>
        </div>

        {/* Wallet button */}
        <div className="p-6 pt-0 relative">
          <SheetClose asChild>
            <div>
              <WalletMultiButton />
            </div>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}