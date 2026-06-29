export const ENTRA_POPUP_NAME = 'entra-login'
export const ENTRA_POPUP_FEATURES =
  'width=500,height=700,menubar=no,toolbar=no,location=yes,status=no'

export const ENTRA_AUTH_MESSAGE = {
  SUCCESS: 'ENTRA_AUTH_SUCCESS',
  ERROR: 'ENTRA_AUTH_ERROR',
} as const

export type EntraAuthMessage =
  | { type: typeof ENTRA_AUTH_MESSAGE.SUCCESS; accessToken: string }
  | { type: typeof ENTRA_AUTH_MESSAGE.ERROR; message: string }

export function isEntraAuthMessage(data: unknown): data is EntraAuthMessage {
  if (!data || typeof data !== 'object') return false

  const msg = data as { type?: string; accessToken?: string; message?: string }

  if (msg.type === ENTRA_AUTH_MESSAGE.SUCCESS) {
    return typeof msg.accessToken === 'string'
  }

  if (msg.type === ENTRA_AUTH_MESSAGE.ERROR) {
    return typeof msg.message === 'string'
  }

  return false
}

export function postToOpener(message: EntraAuthMessage): void {
  window.opener?.postMessage(message, window.location.origin)
}

export function closePopup(): void {
  window.close()
}
