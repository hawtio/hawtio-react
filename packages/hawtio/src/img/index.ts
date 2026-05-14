import userAvatarB64 from './avatarImg.svg'
import backgroundB64 from './background.svg'
import hawtioLogoB64 from './hawtio-logo.svg'

// these assume and require ".svg" loader to be "base64"
// because of:
//  - https://github.com/hawtio/hawtio-react/issues/2088
//  - https://github.com/evanw/esbuild/issues/4045
// so we need proper syntax for CSS `url()` values
const userAvatar = `data:image/svg+xml;base64,${userAvatarB64}`
const background = `data:image/svg+xml;base64,${backgroundB64}`
const hawtioLogo = `data:image/svg+xml;base64,${hawtioLogoB64}`

export { background, hawtioLogo, userAvatar }
