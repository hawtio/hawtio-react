import { helpRegistry } from '@hawtiosrc/help/registry'
import { Nav, NavItem, NavList, PageSection, Title } from '@patternfly/react-core'
import React from 'react'
import { NavLink, Redirect, Route, Switch, useLocation } from 'react-router-dom' // includes NavLink
import help from './help.md'
import { HomePreferences } from './HomePreferences'
import { LogsPreferences } from './LogsPreferences'
import { preferencesRegistry } from './registry'
import { hawtio } from '@hawtiosrc/core'
import { HOME, PREFERENCES } from '@hawtiosrc/RouteConstants'

helpRegistry.add('preferences', 'Preferences', help, 2)
preferencesRegistry.add('home', 'Home', HomePreferences, 1)
preferencesRegistry.add('console-logs', 'Console Logs', LogsPreferences, 2)

export const HawtioPreferences: React.FunctionComponent = () => {
  const { pathname, search } = useLocation()
  return (
    <React.Fragment>
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel='h1'>Preferences</Title>
      </PageSection>
      <PageSection type='tabs' hasBodyWrapper={false}>
        <Nav aria-label='Preferences Nav' variant='horizontal-subnav'>
          <NavList>
            {preferencesRegistry.getPreferences().map(prefs => (
              <NavItem
                key={prefs.id}
                isActive={hawtio.fullPath(pathname) === hawtio.fullPath(PREFERENCES, prefs.id)}
              >
                <NavLink to={{ pathname: hawtio.fullPath(PREFERENCES, prefs.id), search }}>{prefs.title}</NavLink>
              </NavItem>
            ))}
          </NavList>
        </Nav>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Switch>
          {preferencesRegistry.getPreferences().map(prefs => (
            <Route key={prefs.id} path={hawtio.fullPath(PREFERENCES, prefs.id)}>
              {React.createElement(prefs.component)}
            </Route>
          ))}
          <Route exact path={hawtio.fullPath(PREFERENCES)}>
            <Redirect to={{ pathname: hawtio.fullPath(PREFERENCES, HOME), search }} />
          </Route>
        </Switch>
      </PageSection>
    </React.Fragment>
  )
}
