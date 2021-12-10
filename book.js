const THREE = require('three');
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js'
import CubicBezier from 'cubic-bezier-easing'
const Common   = require("./lib/common.js")
const Colormap = require("./lib/colormap.js")

// Particle3D class

const TO_RADIANS = Math.PI/180.0


export class Page {

  constructor() {

    const geometry = this.plateGeometry(10, 13, 9, 1)
    const material = this.plateMaterial("img/page0.jpg", "img/page1.jpg")

    //this.mesh = new THREE.Mesh(geometry, material)
    this.mesh = SceneUtils.createMultiMaterialObject(geometry, material)
    console.log(this.mesh)
    this.initPositions = this.mesh.children[0].geometry.getAttribute("position").clone().array

    this.t = 0
    this.speedSec = 4
    this.doPaging = false

    //this.ease = new CubicBezier(0.0 , 0.0, 1.0 , 1.0)
    //this.ease = new CubicBezier(0.42, 0.0, 1.0 , 1.0)
    //this.ease = new CubicBezier(0.0 , 0.0, 0.58, 1.0)
    this.ease = new CubicBezier(0.42, 0.0, 0.58, 1.0) // ease-in-out 

    this.bendingKeyframes = new Map([[0, 0], [0.5, 15], [1,   0]])
    this.pagingKeyframes  = new Map([[0, -9],  [1, -171]])
  }

  update(dt) {
    if ( ! this.doPaging && this.t > 0 ) return
    this.t += dt
    //this.t += 0.03

    const geometry = this.mesh.children[0].geometry
		const posAttr = geometry.getAttribute("position")
    const positions = posAttr.array

    const w     = geometry.parameters.width 
    const h     = geometry.parameters.height
    const wsegs = geometry.parameters.widthSegments
    const hsegs = geometry.parameters.heightSegments

    const wvers = wsegs + 1
    const hvers = hsegs + 1
    const axis = new THREE.Vector3(0, 1, 0)
    for (let j = 0; j < hvers; j++) {
      let i0 = 3*( j * wvers + 0 )
      let i1 = 3*( j * wvers + 1 )

      let x0 = this.initPositions[i0 + 0]
      let y0 = this.initPositions[i0 + 1]
      let z0 = this.initPositions[i0 + 2]
      let x1 = this.initPositions[i1 + 0]
      let y1 = this.initPositions[i1 + 1]
      let z1 = this.initPositions[i1 + 2]
      let v = new THREE.Vector3(x1-x0, y1-y0, z1-z0)

      for (let i = 0; i < wsegs; i++) {
        i0 = 3*( j * wvers + i  )
        i1 = 3*( j * wvers + i+1)

        x0 = positions[i0 + 0]
        y0 = positions[i0 + 1]
        z0 = positions[i0 + 2]
        const p0 = new THREE.Vector3(x0, y0, z0)

        const rateX = i / (wsegs - 1.0)
        const angle = this.angle( rateX )
        v.applyAxisAngle(axis,  angle * TO_RADIANS)
        v.add(p0)

        positions[i1 + 0] = v.x
        positions[i1 + 1] = v.y
        positions[i1 + 2] = v.z

        x1 = positions[i1 + 0]
        y1 = positions[i1 + 1]
        z1 = positions[i1 + 2]
        v = new THREE.Vector3(x1-x0, y1-y0, z1-z0)
      }
    }
    posAttr.needsUpdate = true
    geometry.computeVertexNormals()
  }

  angle(rate) {
    const timeRate = Math.min(this.t / this.speedSec, 1)
    const t = this.ease(timeRate) 
    const pa = this.getAngle(t, this.pagingKeyframes)
    const ba = this.getAngle(t, this.bendingKeyframes)

    const ang = ( rate == 0  ) ? pa : ba
    return ang
  }

  getAngle(t, keyframes) {
    let t0 = 0
    let a0 = 0
    let t1 = 0
    let a1 = 0
    for (const [k, v] of keyframes) {
      if ( k <= t ) {
        t0 = k
        a0 = v
      } else {
        // k > t
        t1 = k
        a1 = v
        break
      }
    }

    const dt = t1 - t0
    const da = a1 - a0

    const a = ((t-t0) / dt) * da + a0
    return a
  }

  plateGeometry(w, h, wsegs, hsegs) {
    const geometry = new THREE.PlaneGeometry(w, h, wsegs, hsegs)

//    for (let i = 0, len = geometry.faces.length; i < len; i++) {
//      const face = geometry.faces[i].clone();
//      face.materialIndex = 1;
//      geometry.faces.push(face);
//      geometry.faceVertexUvs[0].push(geometry.faceVertexUvs[0][i].slice(0));
//    }

    return geometry
  }

  plateMaterial(fileName0, fileName1) {
    const texture0  = new THREE.TextureLoader().load( fileName0 )
    const texture1  = new THREE.TextureLoader().load( fileName1 )

    const material0 = new THREE.MeshBasicMaterial({map: texture0, side: THREE.FrontSide});
    const material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.BackSide});
    const material = [material0, material1]

    //const material = new THREE.MeshFaceMaterial([material0, material1])
    return material
  }
}

export class Book {

  constructor(numPages) {
    this.pages = []
    for (let j = 0; j < numPages; j++) {
      const page = new Page()
      this.pages.push(page) 
    }
    this.current = -1
  }

  eachPage(callback) {
    for (const p of this.pages) {
      callback(p)
    }
  }

  update(dt) {
    this.eachPage((p)=>{
      p.update(dt)
    })
  }

  currentPage() {
    return this.pages[this.current]
  }

  goForward() {
    ++this.current
    this.current = Math.min(this.current, this.pages.length-1)

    const p = this.currentPage()
    p.doPaging = true
  }

  goBack() {
    --this.current
    this.current = Math.max(this.current, 0)

    const p = this.currentPage()
    p.doPaging = true
  }
}


