// This is our single entry point of the application. Webpack starts from this file and builds up our bundle,
// potentially splitting it into chunks depending on the configuration
//
// The idea is to have JavaScript code statically being part of this file to be loaded in browser very quickly
// If all we used was static `import` statements, everything would be part of single chunk, because only
// the dynamic `import()` creates an "async boundary point". Such boundary is also needed when using Module
// Federation and because we import "react" as shared MF module, we have to use this `import("./bootstrap")`
// trick.
//
// Importing styles first is also a good idea and using `import` ensures proper ordering.
// But mind that even if we import '@patternfly/react-core/dist/styles/base.css' here, the order of PatternFly
// styles won't be predictable - base.css is only a set of basic styles. Styles for particular components
// are imported from these components and these are loaded asynchronously (because of the dynamic `import()`)
// This means that @hawtio/react styles (which are accessed with `import '@hawtio/react/dist/index.css'`) should
// override the Patternfly styles in two ways (no way we can use
// https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer):
//  - if Patternfly rule is defined in '@patternfly/react-core/dist/styles/base.css', we can use the same rule with
//    the same "specificity" - we'll override the Patternfly value by means of ordering
//  - if Patternfly rule is more dynamic (imported together with the component) we have to use more specific
//    rule - usually prepended with "#id-of-hawtio-element"

import '@patternfly/react-core/dist/styles/base.css'
import '@hawtio/react/dist/init.css'
import '@hawtio/react/dist/index.css'
import './index.css'

// create an async boundary point, so remaining part of the application is loaded from different chunks
// See https://webpack.js.org/concepts/module-federation/#uncaught-error-shared-module-is-not-available-for-eager-consumption
import('./bootstrap')

export {}
