import { pluginPath } from '@hawtiosrc/plugins/jmx/globals'
import { AttributeTable, Attributes, Chart, JmxContentMBeans, MBeanNode, Operations } from '@hawtiosrc/plugins/shared'
import {
  Content,
  EmptyState,
  EmptyStateVariant,
  Nav,
  NavItem,
  NavList,
  PageGroup,
  PageSection,
  Title,
} from '@patternfly/react-core'
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon'
import React, { useContext } from 'react'
import { NavLink, Redirect, Route, Switch, useLocation } from 'react-router-dom' // includes NavLink
import './JmxContent.css'
import { MBeanTreeContext, pluginPathWithNodeId } from './context'
import { hawtio } from '@hawtiosrc/core'
import { NODE_ID_ROOT, NODE_ID_TEMPLATE, ROOT } from '@hawtiosrc/RouteConstants'

export const JmxContent: React.FunctionComponent = () => {
  const { selectedNode } = useContext(MBeanTreeContext)
  const { pathname, search } = useLocation()

  if (!selectedNode) {
    return (
      <PageSection hasBodyWrapper={false} isFilled>
        <EmptyState
          headingLevel='h1'
          icon={CubesIcon}
          titleText='Select MBean'
          variant={EmptyStateVariant.full}
        ></EmptyState>
      </PageSection>
    )
  }

  const mBeanApplicable = (node: MBeanNode) => Boolean(node.objectName)
  const mBeanCollectionApplicable = (node: MBeanNode) => Boolean(node.children?.every(child => child.objectName))
  const hasAnyApplicableMBean = (node: MBeanNode) =>
    Boolean(node.objectName) || Boolean(node.children?.some(child => child.objectName))

  const tableSelector = (node: MBeanNode) => {
    const tablePriorityList = [
      { condition: mBeanApplicable, element: Attributes },
      { condition: mBeanCollectionApplicable, element: AttributeTable },
    ]

    return tablePriorityList.find(entry => entry.condition(node))?.element ?? JmxContentMBeans
  }

  const allNavItems = [
    { id: 'attributes', title: 'Attributes', component: tableSelector(selectedNode), isApplicable: () => true },
    { id: 'operations', title: 'Operations', component: Operations, isApplicable: mBeanApplicable },
    { id: 'chart', title: 'Chart', component: Chart, isApplicable: hasAnyApplicableMBean },
  ]

  /* Filter the nav items to those applicable to the selected node */
  const navItems = allNavItems.filter(nav => nav.isApplicable(selectedNode))

  const searchWithNid = (pluginPathWithNodeId(selectedNode, new URLSearchParams(search)) as { search: string }).search

  const mbeanNav = (
    <Nav aria-label='MBean Nav' variant='horizontal-subnav'>
      <NavList>
        {navItems.map(nav => (
          <NavItem
            key={nav.id}
            isActive={hawtio.fullPath(pathname) === hawtio.fullPath(pluginPath, NODE_ID_TEMPLATE, nav.id)}
          >
            <NavLink to={{ pathname: hawtio.fullPath(pluginPath, NODE_ID_TEMPLATE, nav.id), search }}>
              {nav.title}
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  )

  const mbeanRoutes = navItems.map(nav => (
    <Route key={nav.id} path={hawtio.fullPath(pluginPath, NODE_ID_TEMPLATE, nav.id)}>
      {React.createElement(nav.component)}
    </Route>
  ))

  return (
    <PageGroup id='jmx-content'>
      <PageSection id='jmx-content-header' hasBodyWrapper={false}>
        <Title headingLevel='h1'>{selectedNode.name}</Title>
        <Content component='small'>{selectedNode.objectName}</Content>
      </PageSection>
      <PageSection type='tabs' hasBodyWrapper={false}>
        {mbeanNav}
      </PageSection>
      <PageSection
        id='jmx-content-main'
        padding={{ default: 'noPadding' }}
        hasOverflowScroll
        aria-label='jmx-content-main'
        hasBodyWrapper={false}
      >
        <Switch>
          {mbeanRoutes}
          <Route key={NODE_ID_ROOT} exact path={hawtio.fullPath(pluginPath, NODE_ID_TEMPLATE)}>
            <Redirect to={{ pathname: hawtio.fullPath(pluginPath, NODE_ID_TEMPLATE, navItems[0]?.id ?? ''), search: searchWithNid }} />
          </Route>
          <Route key={ROOT} exact path={hawtio.fullPath(pluginPath)}>
            <Redirect to={{ pathname: hawtio.fullPath(pluginPath, navItems[0]?.id ?? ''), search: searchWithNid }} />
          </Route>
        </Switch>
      </PageSection>
    </PageGroup>
  )
}
