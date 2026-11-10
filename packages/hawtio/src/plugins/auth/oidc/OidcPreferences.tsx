import { TooltipHelpIcon } from '@hawtiosrc/ui/icons'
import { CardBody, Checkbox, Form, FormGroup } from '@patternfly/react-core'
import React, { useState } from 'react'
import { HawtioFormSection } from '@hawtiosrc/preferences/HawtioFormSection'
import { oidcPreferencesService } from '@hawtiosrc/plugins/auth/oidc/oidc-preferences-service'

export const OidcPreferences: React.FunctionComponent = () => (
  <CardBody>
    <Form isHorizontal>
      <OidcForm />
    </Form>
  </CardBody>
)

const OidcForm: React.FunctionComponent = () => {
  const [showTokenRefreshNotification, setShowTokenRefreshNotification] = useState(
    oidcPreferencesService.loadOptions()?.showNotifications ?? false,
  )

  const onShowTokenRefreshNotification = (showNotification: boolean) => {
    setShowTokenRefreshNotification(showNotification)
    oidcPreferencesService.saveOptions({ showNotifications: showNotification })
  }

  return (
    <HawtioFormSection title='OpenID Connect'>
      <FormGroup
        label='JWT Token Refresh Information'
        fieldId='oidc-form-refresh-input'
        labelHelp={
          <TooltipHelpIcon tooltip='Whether Hawtio shows a toast notification when JWT Access Token refreshes' />
        }
      >
        <Checkbox
          id='oidc-form-refresh-input'
          isChecked={showTokenRefreshNotification}
          onChange={(_event, value: boolean) => onShowTokenRefreshNotification(value)}
        />
      </FormGroup>
    </HawtioFormSection>
  )
}
