import { isString } from '@hawtiosrc/util/objects'
import { ExpandableSection } from '@patternfly/react-core'
import * as React from 'react'

export const ExpandableText: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  if (isString(children)) {
    return (
      <ExpandableSection
        onClick={e => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          ;(e.target as HTMLElement)?.classList.contains('pf-v6-c-expandable-section__toggle-text') &&
            e.stopPropagation()
        }}
        truncateMaxLines={3}
        variant='truncate'
        toggleTextExpanded='Show less'
        toggleTextCollapsed='Show more'
      >
        {children}
      </ExpandableSection>
    )
  }
  return children
}
