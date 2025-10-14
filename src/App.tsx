
import SiteHeader from './components/site-header'
import { Outlet } from 'react-router'

function App() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <SiteHeader />
      <div className="pt-14">
        <Outlet />
      </div>
    </div>
  )
}

export default App
