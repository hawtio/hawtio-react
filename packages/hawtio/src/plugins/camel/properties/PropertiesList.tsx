import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  Title,
} from '@patternfly/react-core'
import React from 'react'
import { PropertiesTooltippedName } from './PropertiesTooltippedName'
import { Property } from './property'

interface PropertiesListProps {
  title: string
  values: Property[]
}

export const PropertiesList: React.FunctionComponent<PropertiesListProps> = props => {
  return (
    <React.Fragment>
      <Panel variant='bordered'>
        <PanelHeader>
          <Title headingLevel='h1' size='lg'>
            {props.title}
          </Title>
        </PanelHeader>
        <PanelMain>
          {(!props.values || props.values.length === 0) && (
            <PanelMainBody className='properties-no-properties'>No properties</PanelMainBody>
          )}
          {props.values && props.values.length > 0 && (
            <PanelMainBody>
              <DescriptionList columnModifier={{ default: '3Col', lg: '3Col', md: '2Col', sm: '1Col' }}>
                {props.values.map(p => {
                  return (
                    <DescriptionListGroup key={p.name}>
                      <DescriptionListTerm>
                        <PropertiesTooltippedName property={p} />
                      </DescriptionListTerm>
                      {p.value !== null && <DescriptionListDescription>{p.value}</DescriptionListDescription>}
                    </DescriptionListGroup>
                  )
                })}
              </DescriptionList>
            </PanelMainBody>
          )}
        </PanelMain>
      </Panel>
    </React.Fragment>
  )
}
