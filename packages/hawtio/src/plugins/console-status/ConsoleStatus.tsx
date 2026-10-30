import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Flex,
  FlexItem,
  PageSection,
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody,
} from '@patternfly/react-core'
import { HawtioLoadingCard, jolokiaService, workspace } from '@hawtiosrc/plugins/shared'

export const ConsoleStatus: React.FunctionComponent = () => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [errors, setErrors] = useState<Error[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const waitLoading = async () => {
      const hasErrors = await workspace.hasErrors()

      if (hasErrors) {
        const errors = [...(await workspace.getErrors())]
        errors.reverse() // reverse so as to show latest first
        setErrors(errors)
      }

      setLoading(false)
    }

    timerRef.current = setTimeout(waitLoading, 250)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (loading) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Panel>
          <PanelHeader>Waiting workspace to load ...</PanelHeader>
          <PanelMain>
            <PanelMainBody>
              <HawtioLoadingCard />
            </PanelMainBody>
          </PanelMain>
        </Panel>
      </PageSection>
    )
  }

  return (
    <Flex
      direction={{ default: 'column' }}
      justifyContent={{ default: 'justifyContentSpaceBetween' }}
      rowGap={{ default: 'rowGapMd' }}
    >
      <FlexItem>
        <Alert variant='warning' isInline isPlain title='No JMX MBean information is available' />
      </FlexItem>

      {errors.map((error, index) => (
        <FlexItem key={index}>
          <Alert key={index} variant='danger' isInline isPlain title={jolokiaService.errorMessage(error)}>
            {!!error.cause && <p>{jolokiaService.errorMessage(error.cause)}</p>}
          </Alert>
        </FlexItem>
      ))}
    </Flex>
  )
}
