import { Menubar } from '@/components/ui/menubar'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router'
import { MobileSidebar } from './mobile-sidebar'
import { WalletMultiButton } from '@demox-labs/miden-wallet-adapter'

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 w-full border-b bg-background/80 backdrop-blur-sm z-50">
      <Menubar className="h-14 w-full border-0 px-4 md:px-6">
        <div className="flex w-full items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-lg font-bold md:tracking-tight luckiest-guy-regular text-xl md:text-2xl hover:text-primary transition-colors">
            Miden.name
          </Link>

          {/* Desktop Navigation & Wallet */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <a href="https://docs.miden.name/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors">
                Docs
              </a>
              <p className="cursor-pointer text-sm font-medium text-gray-400">Identity - Coming Soon</p>
            </nav>

            <Separator orientation="vertical" className="h-6 w-[2px]" />

            <WalletMultiButton />
          </div>

          {/* Mobile Menu */}
          <MobileSidebar />
        </div>
      </Menubar>
    </header>
  )
}

export default SiteHeader


