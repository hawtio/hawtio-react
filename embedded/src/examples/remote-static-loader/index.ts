import { hawtio, type HawtioPlugin } from '@hawtio/react'

// we import this module from ../index.ts in normal way
// but import() statements used below refer to ModuleFederation identifiers for "remote" modules,
// so the resolution is performed at runtime (in browser)
//
// registerRemoteExamplesStatically() deals with two "exposed" (by webpack + module-federation) modules:
// remote1. The only visible difference in JavaScript code is that instead of:
//     import('../remote1').then()
// we use:
//     import('static-remotes/remote1').then()
//
// there are no warnings in this file thanks to aliases declared in tsconfig.json, which is not used by
// webpack + swc-loader

export const registerRemoteExamplesStatically: HawtioPlugin = () => {
  hawtio.addDeferredPlugin('exampleStaticRemote1', async () => {
    return import('static-remotes/remote1').then(m => {
      // this module exports only the React/PatternFly component, so we register it ourselves
      return {
        id: 'exampleStaticRemote1',
        title: 'Remote plugin 1 (static)',
        group: 'Remote Examples',
        path: '/remote1',
        component: m.RemotePlugin,
        isActive: async () => true,
      }
    })
  })
}
