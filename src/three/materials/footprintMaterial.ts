import { Color, DoubleSide, ShaderMaterial } from 'three'

/**
 * Empreintes en pointillés (motif signature) : un seul `InstancedMesh` de
 * rectangles posés au sol, dessinés par ce shader. Chaque instance porte sa
 * taille (`aSize`, en mètres) et son opacité (`aOpacity`) : les tirets ont la
 * même longueur sur toutes les empreintes, quelle que soit leur taille.
 */
export function createFootprintMaterial(hex: string): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    uniforms: {
      uColor: { value: new Color(hex) },
      uDash: { value: 0.11 },
      uWidth: { value: 0.026 },
    },
    vertexShader: /* glsl */ `
      attribute vec2 aSize;
      attribute float aOpacity;
      varying vec2 vUv;
      varying vec2 vSize;
      varying float vOpacity;
      void main() {
        vUv = uv;
        vSize = aSize;
        vOpacity = aOpacity;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uDash;
      uniform float uWidth;
      varying vec2 vUv;
      varying vec2 vSize;
      varying float vOpacity;
      void main() {
        if (vOpacity < 0.005) discard;
        vec2 p = (vUv - 0.5) * vSize;
        vec2 h = vSize * 0.5 - uWidth;
        vec2 d = abs(abs(p) - h);
        vec2 aa = fwidth(p) * 1.2;
        float onSide = (1.0 - smoothstep(uWidth * 0.5, uWidth * 0.5 + aa.x, d.x)) * step(abs(p.y), h.y + uWidth * 0.5);
        float onEnd = (1.0 - smoothstep(uWidth * 0.5, uWidth * 0.5 + aa.y, d.y)) * step(abs(p.x), h.x + uWidth * 0.5);
        float dashSide = smoothstep(0.42, 0.5, fract((p.y + h.y) / uDash)) ;
        float dashEnd = smoothstep(0.42, 0.5, fract((p.x + h.x) / uDash));
        float alpha = max(onSide * dashSide, onEnd * dashEnd) * vOpacity;
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(uColor, alpha);
        #include <colorspace_fragment>
      }
    `,
  })
}
