import { Nav, NavExpandable, NavItem, NavList, PageSidebar, PageSidebarBody } from '@patternfly/react-core'
import React, { useContext } from 'react'
import { NavLink } from 'react-router'
import { PageContext, useHawtioLocation } from './context'

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

export const HawtioSidebar: React.FunctionComponent = () => {
  const { plugins, pluginGroups, pluginGroupNames } = useContext(PageContext)
  // it's important to not call useLocation(), because `search` for the sidebar links should NOT
  // include `nid` parameter (or any other plugin-specific parameters)
  const { pathname, search } = useHawtioLocation()

  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({})

  let currentGroup = ''
  for (const plugin of plugins) {
    if (plugin.path && plugin.group) {
      if (expandedGroups[plugin.group] === undefined && pathMatch(pathname, plugin.path!)) {
        // change state synchronously in th component function only under spacial conditions
        // but otherwise we should be able to collapse even the group of currently active plugin
        setExpandedGroups(groups => {
          return { ...groups, [plugin.group!]: true }
        })
      }
      if (pathMatch(pathname, plugin.path!)) {
        currentGroup = plugin.group
      }
    }
  }

  const pageNav = (
    <Nav>
      <NavList>
        {pluginGroups['.'] &&
          pluginGroups['.'].map(plugin => (
            <NavItem key={plugin.id} isActive={pathMatch(pathname, plugin.path!)}>
              <NavLink to={{ pathname: plugin.path!, search }}>{plugin.title}</NavLink>
            </NavItem>
          ))}
        {pluginGroupNames
          .filter(g => g !== '.')
          .map(group => (
            <NavExpandable
              key={group}
              title={group}
              groupId={group}
              isExpanded={expandedGroups[group]}
              onExpand={(_event, expand: boolean) => {
                setExpandedGroups(groups => {
                  return { ...groups, [group]: expand }
                })
              }}
              isActive={currentGroup === group}
            >
              {pluginGroups[group]!.map(plugin => (
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
