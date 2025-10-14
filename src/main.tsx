import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/theme-provider'
import { WalletProvider } from '@demox-labs/miden-wallet-adapter-react'
import { MidenWalletAdapter } from '@demox-labs/miden-wallet-adapter'
import { WalletModalProvider } from '@demox-labs/miden-wallet-adapter-reactui'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { MidenClientProvider } from '@/contexts/MidenClientContext'

const Home = lazy(() => import('@/pages/home/page'))
const Register = lazy(() => import('@/pages/register/page'))
const Identity = lazy(() => import('./pages/identity/page.tsx'))
const NotFound = lazy(() => import('./pages/not-found/page.tsx'))

const PageLoader = () => (
  <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
    </div>
  </div>
)

const wallets = [new MidenWalletAdapter({ appName: 'Miden.name' })]

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: "identity",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Identity />
          </Suspense>
        )
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Register />
          </Suspense>
        )
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        )
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider
      wallets={wallets}
    >
      <WalletModalProvider>
        <MidenClientProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </MidenClientProvider>
      </WalletModalProvider>
    </WalletProvider>
  </StrictMode>,
)
