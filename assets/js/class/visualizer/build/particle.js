import Plane from '../../objects/plane.js'
import Sphere from '../../objects/sphere.js'
import Box from '../../objects/box.js'
import GetShaderName from '../shader/particle.shader.js'
import {BoxGeometry} from '../../../lib/three.module.js'

export default class{
    constructor({
        engine,
        scene,
        camera,
        count,
        radius,
        color,
        audioBoost,
        rtt
    }){
        this.engine = engine
        this.scene = scene
        this.camera = camera
        this.count = count
        this.radius = radius
        this.color = color
        this.audioBoost = audioBoost
        this.rtt =  rtt

        this.boost = 15
        this.iter = 2
        this.size = 0.125
        this.tessellation = 4
        this.audioDataAvg = null
        this.direction = [1, -1]
        this.play = false

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
        const position = new BoxGeometry(radius * 1.5, radius * 1.5, radius * 1.5, 100, 100, 100).getAttribute('position').array
        const len = position.length / 3

        this.points = new BABYLON.PointsCloudSystem('pcs', 1, scene)

        this.points.addPoints(len)

        this.points.initParticles = () => {
            for(let i = 0; i < len; i++){
                const idx = i * 3

                const particle = this.points.particles[i]

                const x = position[idx + 0]
                const y = position[idx + 1]
                const z = position[idx + 2]

                particle.position.x = x 
                particle.position.y = y 
                particle.position.z = z 
            }
        }

        this.points.buildMeshAsync().then(() => {
            this.points.initParticles()
            this.points.setParticles()
            this.points.mesh.material = material
            this.points.mesh.material.pointsCloud = true
        })
    }
    createMaterial(){
        const shaderName = GetShaderName()

        const material = new BABYLON.ShaderMaterial('material', this.scene,
            {
                vertex: shaderName,
                fragment: shaderName
            },
            {
                attributes: ['position', 'normal', 'uv'],
                uniforms: ['world', 'worldView', "worldViewProjection", 'view', 'projection', 'viewProjection', 'uColor', 'uAudio', 'uTime', 'uBoost'],
                needAlphaBlending: true,
                needAlphaTesting: true,
            }
        )

        material.setColor3('uColor', this.color)
        material.setFloat('uBoost', this.boost)

        // const material = new BABYLON.StandardMaterial('material', this.scene)
        // material.emissiveColor = this.color
        // material.alpha = 0.5
        // material.alphaMode = BABYLON.Engine.ALPHA_ADD

        return material
    }
    

    // animate
    animate(audioDataAvg){
        this.audioDataAvg = audioDataAvg

        this.render()
    }
    render(){
        const {radius, count, iter, audioDataAvg} = this

        if(audioDataAvg === null) return

        const material = this.points.mesh.material
        const time = window.performance.now()

        this.points.mesh.rotation.x += 0.01
        this.points.mesh.rotation.y += 0.01

        material.setFloat('uTime', time)
        material.setFloat('uAudio', audioDataAvg)
    }
}