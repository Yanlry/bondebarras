import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from 'three'

/**
 * Lumière du soleil (rayon et tache au sol) : mélange additif, opacité portée
 * par un attribut de sommet (`aAlpha`) et modulée par `uIntensity` (la scène
 * s'éclaircit à mesure que la pièce se vide). Aucun calcul d'éclairage.
 *
 * @param hex Teinte de la lumière (sRGB).
 * @param soft Bords adoucis (tache au sol) d'après les UV.
 */
export function createBeamMaterial(hex: string, soft = false): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    toneMapped: false,
    uniforms: {
      uColor: { value: new Color(hex) },
      uIntensity: { value: 0.5 },
    },
    defines: soft ? { SOFT_EDGES: '' } : {},
    vertexShader: /* glsl */ `
      attribute float aAlpha;
      varying float vAlpha;
      varying vec2 vUv;
      void main() {
        vAlpha = aAlpha;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying float vAlpha;
      varying vec2 vUv;
      void main() {
        float alpha = vAlpha * uIntensity;
        #ifdef SOFT_EDGES
          vec2 edge = smoothstep(0.0, 0.18, vUv) * smoothstep(0.0, 0.18, 1.0 - vUv);
          alpha *= edge.x * edge.y;
        #endif
        gl_FragColor = vec4(uColor * alpha, 1.0);
        #include <colorspace_fragment>
      }
    `,
  })
}
