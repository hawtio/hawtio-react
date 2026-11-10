import { type HawtioPlugin } from '@hawtiosrc/core'
import { helpRegistry } from '@hawtiosrc/help/registry'
import help from './help.md'
import { oidcService } from './oidc-service'
import { preferencesRegistry } from '@hawtiosrc/preferences'

const order = 16

export const oidc: HawtioPlugin = () => {
  let helpRegistered = false
  oidcService.registerUserHooks(() => {
    if (!helpRegistered) {
      helpRegistry.add('oidc', 'OpenID Connect', help, 22)
      helpRegistered = true
    }
  })

  return import('./ui').then(m => {
    preferencesRegistry.add('oidc', 'OpenID Connect', m.OidcPreferences, order)
  })
}
