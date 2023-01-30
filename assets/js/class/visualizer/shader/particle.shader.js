import ShaderMethod from '../../../method/method.shader.js'

const name = 'visualizerParticle'

const getShaderName = () => {
    const vertex = `
        attribute vec3 position;
        attribute vec2 uv;
        attribute float audio;

        uniform mat4 worldViewProjection;
        uniform float uBoost;
        uniform float uTime;
        uniform float uAudio;
        uniform float uPointSize;

        varying vec2 vUv;

        ${ShaderMethod.snoise4D()}

        void main(){
            vec3 nPosition = position;

            float x = snoise4D(vec4(position * 0.1 * 0.25, uTime * 0.001 + uAudio)) * uBoost * uAudio;
            float y = snoise4D(vec4(position * 0.2 * 0.25, uTime * 0.001 + uAudio)) * uBoost * uAudio;
            float z = snoise4D(vec4(position * 0.3 * 0.25, uTime * 0.001 + uAudio)) * uBoost * uAudio;

            nPosition += vec3(x, y, z);

            gl_Position = worldViewProjection * vec4(nPosition, 1.0);
            gl_PointSize = uPointSize;

            vUv = uv;
        }
    `
    const fragment = `
        uniform vec3 uColor;    

        varying vec2 vUv;

        void main(){
            // float opacity = distance(vUv, vec2(0.5)) * 2.0;

            gl_FragColor = vec4(uColor, 0.275);
        }
    `
    
    BABYLON.Effect.ShadersStore[name + 'VertexShader'] = vertex
    BABYLON.Effect.ShadersStore[name + 'FragmentShader'] = fragment

    return name
}

export default getShaderName