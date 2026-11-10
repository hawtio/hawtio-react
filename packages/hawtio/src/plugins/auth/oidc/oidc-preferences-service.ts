export const STORAGE_KEY_PREFERENCES = 'oidc.preferences'

export type OidcOptions = {
  showNotifications: boolean
}

export const DEFAULT_OPTIONS: OidcOptions = {
  showNotifications: false,
} as const

export interface IJmxPreferencesService {
  loadOptions(): OidcOptions
  saveOptions(options: Partial<OidcOptions>): void
}

class OidcPreferencesService implements IJmxPreferencesService {
  loadOptions(): OidcOptions {
    const item = localStorage.getItem(STORAGE_KEY_PREFERENCES)
    const savedOptions = item ? JSON.parse(item) : {}
    return { ...DEFAULT_OPTIONS, ...savedOptions }
  }

  saveOptions(options: Partial<OidcOptions>) {
    const updated = { ...this.loadOptions(), ...options }
    localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(updated))
  }
}

export const oidcPreferencesService = new OidcPreferencesService()
