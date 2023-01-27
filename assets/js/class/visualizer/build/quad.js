import Plane from '../../objects/plane.js'

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

        // this.rw = this.engine.getRenderWidth()
        // this.rh = this.engine.getRenderHeight()
        this.aspect = this.engine.getAspectRatio(this.camera)
        this.vw = Method.getVisibleWidth(this.camera, this.aspect, 0)
        this.vh = Method.getVisibleHeight(this.camera, 0)

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const {vw, vh, scene, engine} = this

        this.plane = new Plane({
            geometryOpt: {
                width: vw,
                height: vh
            },
            scene,
            engine
        })
    }
}