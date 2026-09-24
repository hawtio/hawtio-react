import React from 'react'
import { FormSection, Title } from '@patternfly/react-core'

export const HawtioFormSection: React.FC<{
  children: React.ReactNode
  title: string
}> = ({ children, title }) => {
  return (
    <FormSection
      title={
        <Title headingLevel='h2' size='xl'>
          {title}
        </Title>
      }
    >
      {children}
    </FormSection>
  )
}
