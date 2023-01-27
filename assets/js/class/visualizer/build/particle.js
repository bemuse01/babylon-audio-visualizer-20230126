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
        // const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: radius * 2, segments: 64}, scene)
        // const position = [...sphere.getVerticesData('position')]
        // this.scene.removeMesh(sphere)
        // sphere.dispose()
        const position = new BoxGeometry(radius * 1.5, radius * 1.5, radius * 1.5, 60, 60, 60).getAttribute('position').array

        const len = position.length / 3
        const matrices = new Float32Array(len * 16)

        this.plane = new Box({
            geometryOpt: {
                size: size * 1,
                sideOrientation: BABYLON.Mesh.FRONTSIDE
            },
            scene,
            engine,
        })
        this.plane.setMaterial(material)

        // this.scene.removeMesh(this.plang.get())
        this.rtt.renderList.push(this.plane.get())

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
        const shaderName = GetShaderName()

        const material = new BABYLON.ShaderMaterial('material', this.scene,
            {
                vertex: shaderName,
                fragment: shaderName
            },
            {
                attributes: ['position', 'normal', 'uv'],
                uniforms: ['world', 'worldView', "worldViewProjection", 'view', 'projection', 'viewProjection', 'uColor', 'cameraPosition'],
                needAlphaBlending: true,
                needAlphaTesting: true,
            }
        )

        material.setColor3('uColor', this.color)
        material.setVector3('cameraPosition', this.camera.position)

        // const material = new BABYLON.StandardMaterial('material', this.scene)
        // material.emissiveColor = this.color
        // material.alpha = 0.5
        // material.alphaMode = BABYLON.Engine.ALPHA_ADD

        return material
    }
    

    // animate
    animate(audioData){
        this.audioData = audioData

        this.render()
    }
    render(){
        const {radius, count, iter, audioBoost, audioData} = this

        this.plane.get().rotation.x += 0.01
        this.plane.get().rotation.y += 0.01
        // this.plane.get().rotation.z += 0.01

        if(!audioData) return
    }
}