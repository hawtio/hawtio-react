import { Nav, NavExpandable, NavItem, NavList, PageSidebar, PageSidebarBody } from '@patternfly/react-core'
import React, { useContext } from 'react'
import { NavLink } from 'react-router'
import { PageContext, useHawtioLocation } from './context'
import { type Plugin } from '@hawtiosrc/core'
import { stringSorter } from '@hawtiosrc/util/strings'

export const HawtioSidebar: React.FunctionComponent = () => {
  const { plugins } = useContext(PageContext)
  // it's important to not call useLocation(), because `search` for the sidebar links should NOT
  // include `nid` parameter (or any other plugin-specific parameters)
  const { pathname, search } = useHawtioLocation()

  const pathMatch = (path: string, pluginPath: string) => {
    while (pluginPath.startsWith('/')) {
      pluginPath = pluginPath.substring(1)
    }
    const slash = pluginPath.indexOf('/')
    if (slash != -1) {
      pluginPath = pluginPath.substring(0, slash)
    }
    return path.split('/', 2)?.[1] === pluginPath
  }

  // put plugins into groups if needed
  const groups: Record<string, Plugin[]> = {}
  const groupNames: string[] = []
  const notGrouped: Plugin[] = []

  let currentGroup = ''

  for (const plugin of plugins) {
    if (!plugin.path) {
      continue
    }
    if (plugin.group) {
      if (!groups[plugin.group]) {
        groups[plugin.group] = []
        groupNames.push(plugin.group)
      }
      groups[plugin.group]!.push(plugin)
      if (pathMatch(pathname, plugin.path!)) {
        currentGroup = plugin.group
      }
    } else {
      notGrouped.push(plugin)
    }
  }

  groupNames.sort((a, b) => stringSorter(a, b))

  const pageNav = (
    <Nav>
      <NavList>
        {notGrouped.map(plugin => (
          <NavItem key={plugin.id} isActive={pathMatch(pathname, plugin.path!)}>
            <NavLink to={{ pathname: plugin.path!, search }}>{plugin.title}</NavLink>
          </NavItem>
        ))}
        {groupNames.map(group => (
          <NavExpandable
            key={group}
            title={group}
            groupId={group}
            isExpanded={currentGroup === group}
            isActive={currentGroup === group}
          >
            {groups[group]!.map(plugin => (
              <NavItem
                itemId={plugin.path}
                groupId={group}
                key={plugin.id}
                isActive={pathMatch(pathname, plugin.path!)}
              >
                <NavLink to={{ pathname: plugin.path!, search }}>{plugin.title}</NavLink>
              </NavItem>
            ))}
          </NavExpandable>
        ))}
      </NavList>
    </Nav>
  )

  return (
    <PageSidebar>
      <PageSidebarBody>{pageNav}</PageSidebarBody>
    </PageSidebar>
  )
}
