import Plane from '../../objects/plane.js'
import GetShaderName from '../shader/particle.shader.js'

export default class{
    constructor({
        engine,
        scene,
        camera,
        count,
        radius,
        color,
        audioBoost
    }){
        this.engine = engine
        this.scene = scene
        this.camera = camera
        this.count = count
        this.radius = radius
        this.color = color
        this.audioBoost = audioBoost

        this.iter = 2
        this.size = 0.125
        this.tessellation = 4
        this.audioData = null
        this.direction = [1, -1]

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const {scene, engine, size, tessellation, count, iter, radius} = this

        const material = this.createMaterial()
        const position = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: radius * 2, segments: 64}, scene).getVerticesData('position')
        const len = position.length / 3
        const matrices = new Float32Array(len * 16)

        this.plane = new Plane({
            geometryOpt: {
                size,
                scene,
                engine
            }
        })
        this.plane.get().visible  = false

        for(let i = 0; i < len; i++){
            const idx = i * 3

            const x = position[idx + 0]
            const y = position[idx + 1]
            const z = position[idx + 2]

            const matrix = BABYLON.Matrix.Translation(x, y, z)
            matrix.copyToArray(matrices, 16 * i)
        }

        this.plane.get().thinInstanceSetBuffer('matrix', matrices, 16)
    }
    createMaterial(){
        // const shaderName = GetShaderName()

        // const material = new BABYLON.ShaderMaterial('material', this.scene,
        //     {
        //         vertex: shaderName,
        //         fragment: shaderName
        //     },
        //     {
        //         attributes: ['position', 'uv'],
        //         uniforms: ['worldViewProjection', 'uColor'],
        //         needAlphaBlending: true,
        //         needAlphaTesting: true,
        //     }
        // )

        // material.setColor3('uColor', this.color)

        const material = new BABYLON.StandardMaterial('material', this.scene)
        material.emissiveColor = this.color
        // material.alpha = 0.5
        material.alphaMode = BABYLON.Engine.ALPHA_ADD

        return material
    }
    

    // set
    setPosition(position){
        const sps = this.particle.getSPS()
        const len = position.length / 3

        for(let i = 0; i < len; i++){
            const idx = i * 3
            const particle = sps.particles[i]

            const x = position[idx + 0]
            const y = position[idx + 1]
            const z = position[idx + 2]

            particle.position.x = x
            particle.position.y = y
            particle.position.z = z
        }

        sps.setParticles()
    }


    // animate
    animate(audioData){
        this.audioData = audioData

        // this.render()
    }
    render(){
        const {radius, count, iter, audioBoost, audioData} = this

        if(!audioData) return

        const sps = this.particle.getSPS()

        const degree = 360 / count
        let n = 0

        for(let j = 0; j < iter; j++){

            const direction = this.direction[j]

            for(let i = 0; i < count; i++){
                const particle = sps.particles[n++]

                const rad = radius + audioData[i] * audioBoost * direction
                const deg = degree * i * RADIAN
                const x = Math.cos(deg) * rad
                const y = Math.sin(deg) * rad

                particle.position.x = x
                particle.position.y = y
            }

        }

        sps.setParticles()
    }
}