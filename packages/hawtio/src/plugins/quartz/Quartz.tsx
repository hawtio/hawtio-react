import { PageSection, Spinner } from '@patternfly/react-core'
import React from 'react'
import Split from 'react-split'
import './../shared/Jmx.css'
import { QuartzContent } from './QuartzContent'
import { QuartzTreeView } from './QuartzTreeView'
import { QuartzContext, useQuartz } from './context'

export const Quartz: React.FunctionComponent = () => {
  const { tree, loaded, selectedNode, setSelectedNode } = useQuartz()

  if (!loaded) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Spinner aria-label='Loading Quartz schedulers' />
      </PageSection>
    )
  }

  return (
    <QuartzContext.Provider value={{ tree, selectedNode, setSelectedNode }}>
      <Split className='jmx-split' sizes={[20, 80]} minSize={100} gutterSize={5}>
        <div>
          <QuartzTreeView />
        </div>
        <div>
          <QuartzContent />
        </div>
      </Split>
    </QuartzContext.Provider>
  )
}
