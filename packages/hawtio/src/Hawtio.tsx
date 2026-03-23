import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { hawtio } from './core'
import { HawtioLogin } from './ui/login'
import { HawtioPage } from './ui/page'
import { INDEX, LOGIN, WILDCARD } from './RouteConstants'
import { HawtioRouter } from './HawtioRouter'

export type HawtioProps = {
  basepath?: string
}

export const Hawtio: React.FunctionComponent<HawtioProps> = props => {
  const { basepath } = props

  if (basepath) {
    hawtio.setBasePath(basepath)
  }

  /*
   * Initialise a window theme listener to update the application theme
   * depending on the browser's chosen / default theme or Hawtio preferences.
   *
   * Note: Will be ignored if a hawtio.disableThemeListener flag is set
   * to true in localStorage.
   */
  hawtio.addWindowThemeListener()

  useEffect(() => {
    return () => {
      /*
       * Clean up the window listener on unmount
       */
      hawtio.removeWindowThemeListener()
    }
  }, [])

  return (
    <HawtioRouter initialEntries={[hawtio.fullPath(INDEX)]}>
      <Routes>
        <Route path={hawtio.fullPath(LOGIN)} element={<HawtioLogin />} />
        <Route path={hawtio.fullPath(INDEX)} element={<HawtioPage />} />
        <Route path={hawtio.fullPath(WILDCARD)} element={<HawtioPage />} />
      </Routes>
    </HawtioRouter>
  )
}
