let cachedSupport: boolean | undefined

/**
 * `true` si le navigateur sait créer un contexte WebGL.
 * Le test n'est fait qu'une fois et le contexte d'essai est aussitôt libéré.
 * Sans WebGL, la pièce est remplacée par ses images « avant / après ».
 */
export function supportsWebGL(): boolean {
  if (cachedSupport !== undefined) return cachedSupport
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    cachedSupport = Boolean(context)
    context?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cachedSupport = false
  }
  return cachedSupport
}
