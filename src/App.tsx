import { BrowserRouter } from 'react-router-dom'
import { ScrollToTop } from './components/navigation/ScrollToTop'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
