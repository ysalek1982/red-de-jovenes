import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToHash, scrollToPageTop } from '../../lib/scroll'

export function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    if (location.hash) {
      scrollToHash(location.hash, 'auto')
      return
    }

    scrollToPageTop({ behavior: 'auto', focus: true })
  }, [location.hash, location.pathname, location.search])

  return null
}
