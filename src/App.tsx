import { BrowserRouter } from 'react-router-dom'
import { AppErrorBoundary } from './components/errors/AppErrorBoundary'
import { ScrollToTop } from './components/navigation/ScrollToTop'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppErrorBoundary moduleName="la app" resetKey="app-root">
        <AppRoutes />
      </AppErrorBoundary>
    </BrowserRouter>
  )
}

export default App
