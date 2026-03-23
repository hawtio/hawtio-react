import { hawtio, usePlugins } from '@hawtiosrc/core'
import { CardBody, Content, Nav, NavItem, NavList, PageGroup, PageSection, Title } from '@patternfly/react-core'
import React, { useMemo } from 'react'
import Markdown from 'react-markdown'
import { NavLink, Redirect, Route, Switch, useLocation } from 'react-router-dom' // includes NavLink
import help from './help.md'
import { helpRegistry } from './registry'
import { HELP, INDEX, HOME } from '@hawtiosrc/RouteConstants'

helpRegistry.add(HOME, 'Home', help, 1)

export const HawtioHelp: React.FunctionComponent = () => {
  const { pathname, search } = useLocation()
  const { plugins } = usePlugins()

  const helps = useMemo(() => {
    const pluginIds = hawtio.getPlugins().map(p => p.id)
    const activePlugins = plugins.map(p => p.id)
    return helpRegistry.getHelps().filter(help => {
      if (pluginIds.includes(help.id)) {
        return activePlugins.includes(help.id)
      }
      return true
    })
  }, [plugins])

  return (
    <PageGroup id='hawtio-help'>
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel='h1'>Help</Title>
      </PageSection>
      <PageSection type='tabs' hasBodyWrapper={false}>
        <Nav aria-label='Help Nav' variant='horizontal-subnav'>
          <NavList>
            {helps.map(help => (
              <NavItem key={help.id} isActive={pathname === hawtio.fullPath(HELP, help.id)}>
                <NavLink to={{ pathname: hawtio.fullPath(HELP, help.id), search }}>{help.title}</NavLink>
              </NavItem>
            ))}
          </NavList>
        </Nav>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <Switch>
          {helpRegistry.getHelps().map(({ id, content }) => (
            <Route
              key={id}
              path={hawtio.fullPath(HELP, id)}>
              <CardBody>
                <Content>
                  <Markdown>{content}</Markdown>
                </Content>
              </CardBody>
            </Route>
          ))}
          <Route path={INDEX}>
            <Redirect to={{ pathname: hawtio.fullPath(HELP, HOME), search }} />
          </Route>
        </Switch>
      </PageSection>
    </PageGroup>
  )
}
