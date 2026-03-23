import { Nav, NavItem, NavList, PageSection, Title } from '@patternfly/react-core'
import React from 'react'
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router'
import { Metrics } from './Metrics'
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
      <PageSection hasBodyWrapper={false}>
        <Routes>
          {navItems.map(({ id, component }) => (
            <Route key={id} path={id} element={component} />
          ))}
          <Route path='/' element={<Navigate to={{ pathname: hawtio.fullPath(pluginPath, navItems[0]?.id ?? ''), search }} replace={true} />} />
        </Routes>
      </PageSection>
    </React.Fragment>
  )
}
