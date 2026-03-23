/**
 * HawtioRouter encapsulates a MemoryRouter which allows the latter
 * to be nested inside a BrowserRouter. A default implementation throws
 * an error message directing that 2 routes cannot be routed inside one
 * another.
 * The preferred mechanism for nested routes in React-Router is to nest
 * Routes and let the parent BrowserRouter handle them. However, these
 * requires the single Parent Route to be a splat / wildcard allowing the
 * sub-Routes to be handled correctly. Unforunately, the OpenShift Console
 * Plugin SDK does not handle this in all extension use-cases
 * (see https://github.com/openshift/console/issues/17533).
 * Since this is not available we need to use this custom Router.
 */

import React, { useMemo } from 'react'
import {
  BrowserRouter,
  BrowserRouterProps,
  MemoryRouter,
  MemoryRouterProps,
  UNSAFE_LocationContext as LocationContext,
  UNSAFE_NavigationContext as NavigationContext,
  UNSAFE_RouteContext as RouteContext,
  useInRouterContext,
  useLocation,
} from 'react-router'

const EmbeddedMemoryRouter: React.FC<MemoryRouterProps> = ({ children, ...props }) => {
  // Captured from the host OpenShift Console router BEFORE shadowing contexts
  const hostLocation = useLocation()

  // Memoized so host Console re-renders do not emit a fresh context object reference
  const resetRouteContext = useMemo(
    () => ({
      outlet: null,
      matches: [],
      isDataRoute: false,
    }),
    [],
  )

  return (
    <LocationContext.Provider value={null as never}>
      <NavigationContext.Provider value={null as never}>
        <RouteContext.Provider value={resetRouteContext}>
          <MemoryRouter key={hostLocation.pathname} {...props}>
            {children}
          </MemoryRouter>
        </RouteContext.Provider>
      </NavigationContext.Provider>
    </LocationContext.Provider>
  )
}

export const HawtioRouter: React.FC<BrowserRouterProps & MemoryRouterProps> = ({
  children,
  ...props
}) => {
  const isEmbedded = useInRouterContext()

  if (isEmbedded) {
    return <EmbeddedMemoryRouter {...props}>{children}</EmbeddedMemoryRouter>
  }

  return <BrowserRouter {...props}>{children}</BrowserRouter>
}
