const THREE = require('three');
const Common     = require("./lib/common.js")
const Colormap   = require("./lib/colormap.js")

// Particle3D class

const TO_RADIANS = Math.PI/180.0

export class Snow {

  constructor(num, minX, maxX, minY, maxY, minZ, maxZ, scene) {
    this.num = num
    this.rangeMinX = minX
    this.rangeMaxX = maxX
    this.rangeMinY = minY
    this.rangeMaxY = maxY
    this.rangeMinZ = minZ
    this.rangeMaxZ = maxZ

    this.scene = scene

    this.dwell    = new Array(num).fill(0)
    this.maxDwell = 5

    this.colormap   = new Colormap('white')
  }

  init() {
    this.shouldStop = false
    if ( this.flakes !== void 0 )  return

    const positions = new Float32Array(this.num * 3)
    const colors    = new Float32Array(this.num * 3)

    const color = new THREE.Color()
    for (let i = 0; i < this.num; i++) {
      const x = Common.randomReal(this.rangeMinX, this.rangeMaxX) 
      const y = Common.randomReal(this.rangeMaxY, this.rangeMaxY * 4)
      const z = Common.randomReal(this.rangeMinZ, this.rangeMaxZ)

      positions[i * 3 + 0] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      color.set( this.colormap.choose() )
      const r = color.r
      const g = color.g
      const b = color.b

      colors[i * 3 + 0] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute(   'color', new THREE.BufferAttribute(   colors, 3))

    //const fileName = `img/fish_10.png`
    const fileName = `img/snowflake.png`
    const texture  = new THREE.TextureLoader().load( fileName )

    const material = new THREE.PointsMaterial({
      color: 0xffffff, 
      size: 0.5, 
      map: texture, 
      transparent: true, 
      vertexColors: true,
      blending: THREE.AdditiveBlending, 
      depthWrite: false
      //depthTest: false, 
    });

    this.flakes = new THREE.Points( geometry, material )

    this.velocities = []
    this.gravities  = []
    this.drags      = []

    for (let i = 0; i < this.num; i++) {
      const v = new THREE.Vector3(0, -2, 0)
      const g = new THREE.Vector3(0,0,0)
      const d = 1

      this.rotateX(v, Common.random(-45,  45) * TO_RADIANS) 
      this.rotateY(v, Common.random(  0, 360) * TO_RADIANS)

      this.velocities.push(v)
      this.gravities.push(g)
      this.drags.push(d)
    }

    this.scene.add(this.flakes)
  }

  changeColor() {
    const colors = this.flakes.geometry.attributes.color.array

    const color = new THREE.Color()
    for (let i = 0; i < this.num; i++) {
      color.set( this.colormap.choose() )
      const r = color.r
      const g = color.g
      const b = color.b

      colors[i * 3 + 0] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }

    this.flakes.geometry.attributes.color.needsUpdate = true
  }

  update(dt) {
    if ( this.flakes === void 0  )  return
    if ( this.shouldStop         )  return

    const positions = this.flakes.geometry.attributes.position.array

    const rangeX = this.rangeMaxX - this.rangeMinX
    const rangeY = this.rangeMaxY - this.rangeMinY
    const rangeZ = this.rangeMaxZ - this.rangeMinZ
    for (let i = 0; i < this.num; i++) {

      let x = positions[i * 3 + 0]
      let y = positions[i * 3 + 1]
      let z = positions[i * 3 + 2]

      const dwell = this.dwell[i]

      if ( this.shouldProceed(dwell, x, y, z) ) {
        const v = this.velocities[i]
        const g = this.gravities[i]
        const d = this.drags[i]

        v.multiplyScalar(d)
        v.add(g)
        x += v.x * dt
        y += v.y * dt
        z += v.z * dt
      } else {
        if ( this.isDwelling(dwell) ) {
          this.dwell[i] += dt
        } else {
          if ( y < this.rangeMinY ) y += rangeY
          this.dwell[i] = 0 
        }
      }

      if      ( x > this.rangeMaxX ) x -= rangeX
      else if ( x < this.rangeMinX ) x += rangeX

      if      ( z > this.rangeMaxZ ) z -= rangeZ
      else if ( z < this.rangeMinZ ) z += rangeZ
      positions[i * 3 + 0] = x 
      positions[i * 3 + 1] = y 
      positions[i * 3 + 2] = z 
    }

    this.flakes.geometry.attributes.position.needsUpdate = true
  }


  reset() {
    if ( this.flakes === void 0  )  return

    const positions = this.flakes.geometry.attributes.position.array

    for (let i = 0; i < this.num; i++) {
      const x = Common.randomReal(this.rangeMinX, this.rangeMaxX) 
      const y = Common.randomReal(this.rangeMaxY, this.rangeMaxY * 4)
      const z = Common.randomReal(this.rangeMinZ, this.rangeMaxZ)

      positions[i * 3 + 0] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }

    this.flakes.geometry.attributes.position.needsUpdate = true
  }

  hide() {
    this.shouldStop = true
    this.reset()
  }

  shouldProceed(dwell, x, y, z) {
    return dwell == 0 && y > this.rangeMinY
  }

  isDwelling(dwell) {
    return dwell < this.maxDwell
  }


  rotateX(v, angle) {
    const axis = new THREE.Vector3(1, 0, 0)
    v.applyAxisAngle(axis, angle)
    return v
  }

  rotateY(v, angle) {
    const axis = new THREE.Vector3(0, 1, 0)
    v.applyAxisAngle(axis, angle)
    return v
  }

  rotateZ(v, angle) {
    const axis = new THREE.Vector3(0, 0, 1)
    v.applyAxisAngle(axis, angle)
    return v
  }
}



