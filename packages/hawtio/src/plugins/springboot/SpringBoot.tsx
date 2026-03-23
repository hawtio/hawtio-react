import { Nav, NavItem, NavList, PageSection, Title } from '@patternfly/react-core'
import React, { useEffect, useState } from 'react'
import { NavLink, Redirect, Route, Switch, useLocation } from 'react-router-dom' // includes NavLink
import { Health } from './Health'
import { Info } from './Info'
import { Loggers } from './Loggers'
import { TraceView } from './TraceView'
import { springbootService } from './springboot-service'
import { hawtio } from '@hawtiosrc/core'
import { pluginPath } from './globals'

type NavItem = {
  id: string
  title: string
  component: JSX.Element
}

export const SpringBoot: React.FunctionComponent = () => {
  const { pathname, search } = useLocation()
  const [navItems, setNavItems] = useState<NavItem[]>([])

  useEffect(() => {
    const initNavItems = async () => {
      const nav: NavItem[] = []
      if (await springbootService.hasEndpoint('Health')) {
        nav.push({ id: 'health', title: 'Health', component: <Health /> })
      }

      if (await springbootService.hasEndpoint('Info')) {
        nav.push({ id: 'info', title: 'Info', component: <Info /> })
      }

      if (await springbootService.hasEndpoint('Loggers')) {
        nav.push({ id: 'loggers', title: 'Loggers', component: <Loggers /> })
      }

      // Spring Boot 2.x
      if (await springbootService.hasEndpoint('Httptrace')) {
        springbootService.setIsSpringBoot3(false)
        nav.push({ id: 'trace', title: 'Trace', component: <TraceView /> })
      }

      // Spring Boot 3.x
      if (await springbootService.hasEndpoint('Httpexchanges')) {
        springbootService.setIsSpringBoot3(true)
        nav.push({ id: 'trace', title: 'Trace', component: <TraceView /> })
      }

      setNavItems([...nav])
    }
    initNavItems()
  }, [])

  return (
    <React.Fragment>
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel='h1'>Spring Boot</Title>
      </PageSection>
      <PageSection type='tabs' hasBodyWrapper={false}>
        <Nav aria-label='Spring Boot Nav' variant='horizontal-subnav'>
          <NavList>
            {navItems.map(({ id, title }) => (
              <NavItem key={id} isActive={hawtio.fullPath(pathname) === hawtio.fullPath(pluginPath, id)}>
                <NavLink to={{ pathname: hawtio.fullPath(pluginPath, id), search }}>{title}</NavLink>
              </NavItem>
            ))}
          </NavList>
        </Nav>
      </PageSection>
      <PageSection aria-label='Spring Boot Content' padding={{ default: 'noPadding' }} hasBodyWrapper={false}>
        <Switch>
          {navItems.map(({ id, component }) => (
            <Route key={id} path={hawtio.fullPath(pluginPath, id)}>
              {component}
            </Route>
          ))}
          <Route exact path={hawtio.fullPath(pluginPath)}>
            <Redirect to={hawtio.fullPath(pluginPath, navItems[0]?.id ?? '')} />
          </Route>
        </Switch>
      </PageSection>
    </React.Fragment>
  )
}
