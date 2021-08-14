const THREE = require('three');
const Common     = require("./lib/common.js")

// Particle3D class

const TO_RADIANS = Math.PI/180.0

export class Snow {

  constructor(num, rangeMin = -1000, rangeMax = 1000) {
    this.num = num
    this.rangeMin = rangeMin
    this.rangeMax = rangeMax

    const positions = new Float32Array(this.num * 3)

    for (let i = 0; i < this.num; i++) {
      const x = Common.randomReal(this.rangeMin, this.rangeMax) 
      const y = Common.randomReal(this.rangeMin, this.rangeMax)
      const z = Common.randomReal(this.rangeMin, this.rangeMax)

      positions[i * 3 + 0] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute(positions, 3))

    const fileName = `img/snowflake.png`
    const texture  = new THREE.TextureLoader().load( fileName )

    const material = new THREE.PointsMaterial({
      color: 0xffffff, 
      size: 20, 
      map: texture, 
      transparent: true, 
      //blending: THREE.AdditiveBlending, 
      //depthTest: false, 
      //transparent: true 
    });


    this.flakes = new THREE.Points( geometry, material );

    this.velocities = []
    this.gravities  = []
    this.drags      = []

    for (let i = 0; i < this.num; i++) {
      const v = new THREE.Vector3(0, -8, 0)
      const g = new THREE.Vector3(0,0,0)
      const d = 1

      this.rotateX(v, Common.random(-45,  45) * TO_RADIANS) 
      this.rotateY(v, Common.random(  0, 360) * TO_RADIANS)

      this.velocities.push(v)
      this.gravities.push(g)
      this.drags.push(d)
    }

  }

  changeColor(c) {
    this.flakes.material.color.set(c)
  }

  updatePhysics(color) {


    const positions = this.flakes.geometry.attributes.position.array

    const range = this.rangeMax - this.rangeMin
    for (let i = 0; i < this.num; i++) {
      const v = this.velocities[i]
      const g = this.gravities[i]
      const d = this.drags[i]

      v.multiplyScalar(d)
      v.add(g)

      let x = positions[i * 3 + 0]
      let y = positions[i * 3 + 1]
      let z = positions[i * 3 + 2]

      x += v.x
      y += v.y
      z += v.z

      if      ( y < this.rangeMin ) y += range

      if      ( x > this.rangeMax ) x -= range
      else if ( x < this.rangeMin ) x += range

      if      ( z > this.rangeMax ) z -= range
      else if ( z < this.rangeMin ) z += range

      positions[i * 3 + 0] = x 
      positions[i * 3 + 1] = y 
      positions[i * 3 + 2] = z 
    }

    this.flakes.geometry.attributes.position.needsUpdate = true;
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



