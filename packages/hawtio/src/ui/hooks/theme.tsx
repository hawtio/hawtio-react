import { useState, useEffect } from 'react'
import { PATTERNFLY_THEME_CLASS } from '@hawtiosrc/core'

export function useIsDarkTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(() =>
    document.documentElement.classList.contains(PATTERNFLY_THEME_CLASS),
  )

  useEffect(() => {
    // Watch for class changes on the root HTML element
    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.classList.contains(PATTERNFLY_THEME_CLASS))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'], // Only trigger if classes change
    })

    return () => observer.disconnect()
  }, [])

  return isDarkTheme
}
