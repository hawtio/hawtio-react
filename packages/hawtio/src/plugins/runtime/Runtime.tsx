import { Nav, NavItem, NavList, PageGroup, PageSection, Title } from '@patternfly/react-core'
import React from 'react'
import { NavLink, Redirect, Route, Switch, useLocation } from 'react-router-dom' // includes NavLink
import { Metrics } from './Metrics'
import './Runtime.css'
import { SysProps } from './SysProps'
import { Threads } from './Threads'
import { pluginPath } from './globals'
import { hawtio } from '@hawtiosrc/core'

type NavItem = {
  id: string
  title: string
  component: JSX.Element
}

export const Runtime: React.FunctionComponent = () => {
  const { pathname, search } = useLocation()
  const navItems: NavItem[] = [
    { id: 'sysprops', title: 'System properties', component: <SysProps /> },
    { id: 'metrics', title: 'Metrics', component: <Metrics /> },
    { id: 'threads', title: 'Threads', component: <Threads /> },
  ]

  return (
    <React.Fragment>
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel='h1'>Runtime</Title>
      </PageSection>
      <PageGroup>
        <PageSection type='tabs' hasBodyWrapper={false}>
          <Nav aria-label='Runtime Nav' variant='horizontal-subnav'>
            <NavList>
              {navItems.map(({ id, title }) => (
                <NavItem key={id} isActive={hawtio.fullPath(pathname) === hawtio.fullPath(pluginPath, id)}>
                  <NavLink to={{ pathname: hawtio.fullPath(pluginPath, id), search }}>{title}</NavLink>
                </NavItem>
              ))}
            </NavList>
          </Nav>
        </PageSection>
      </PageGroup>
      <PageSection padding={{ default: 'noPadding' }} hasBodyWrapper={false}>
        <Switch>
          {navItems.map(({ id, component }) => (
            <Route key={id} path={hawtio.fullPath(pluginPath, id)}>
              {component}
            </Route>
          ))}
          <Route path={hawtio.fullPath(pluginPath)}>
            <Redirect to={{ pathname: hawtio.fullPath(pluginPath, navItems[0]?.id ?? ''), search }} />
          </Route>
        </Switch>
      </PageSection>
    </React.Fragment>
  )
}
