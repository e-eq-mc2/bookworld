import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Snow }  from  './snow.js'
import { Book, Page }  from  './book.js'
const Common = require("./lib/common.js")

function randomRange(min, max) {
	return ((Math.random()*(max-min)) + min); 
}

//let SCREEN_WIDTH  = window.innerWidth
//let SCREEN_HEIGHT = window.innerHeight

const container = document.body

let renderer, scene, camera, stats

let mouseX = 0
let mouseY = 0

let book, snow

init()
let lastUpdate = performance.now()
animate()

function init() {
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight )
  document.body.appendChild( renderer.domElement )
	//renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  //container.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(
    60, 
    window.innerWidth / window.innerHeight,
    1, 
    1000 
  );

	camera.position.z = 20
	scene.add(camera);

  const axesHelper = new THREE.AxesHelper( 5 )
  //scene.add( axesHelper )

  book = new Book(20, 12, 10)
  book.eachPage((p) => {
    scene.add( p.mesh )
  })

  const minX = -50
  const maxX =  50
  const minY = - book.height / 2
  const maxY = book.height * 4
  const minZ = -50
  const maxZ =  50
  snow= new Snow(8000, minX, maxX, minY, maxY, minZ, maxX, scene)
  //scene.add( snow.flakes )

	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	//document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  window.addEventListener( 'resize', onWindowResize )

  stats = new Stats();
  //document.body.appendChild( stats.dom );

  const controls = new OrbitControls( camera, renderer.domElement );
  //controls.target.set( 0, 10, 0 );
  controls.update();
}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

    const windowHalfX   = window.innerWidth / 2
    const windowHalfY   = window.innerHeight / 2
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

    const windowHalfX   = window.innerWidth / 2
    const windowHalfY   = window.innerHeight / 2
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  const now = performance.now()
  const deltaT = (now - lastUpdate) / 1000
  if (deltaT  === void 0) {
    console.log(now, lastUpdate)
  }
  book.update(deltaT)
  lastUpdate = now

  snow.update(deltaT)

	renderer.render(scene, camera)		
  stats.update()
}

//looks for key presses and logs them
document.body.addEventListener("keydown", function(e) {
  console.log(`key: ${e.key}`);

  switch(true) {
    case e.key == 'f':
      book.goForward() 
      //console.log(book.current, book.currentPage().time,  book.currentPage().direction)
      break

    case e.key == 'b':
      book.goBack() 
      //console.log(book.current, book.currentPage().time,  book.currentPage().direction)
      break


    case e.key == '0':
      snow.colormap.set('black')
      break
    case e.key == '1':
      snow.colormap.set('white')
      break
    case e.key == '2':
      snow.colormap.set('blue-black')
      break
    case e.key == '3':
      snow.colormap.set('aqua-black')
      break
    case e.key == '4':
      snow.colormap.set('green-black')
      break
    case e.key == '5':
      snow.colormap.set('yellow-black')
      break
    case e.key == '6':
      snow.colormap.set('red-black')
      break
    case e.key == '7':
      snow.colormap.set('rose-black')
      break
    case e.key == '8':
      snow.colormap.set('purple-black')
      break
    case e.key == 'm':
      snow.colormap.set('mix-black')

    case e.key == "W":
      {
        let b = Math.cbrt(snow.colormap.getBlackRate())
        b += 0.1
        b = b ** 3
        snow.colormap.setBlackRate(b)
      }
      break

    case e.key == "w":
      {

        let b = Math.cbrt(snow.colormap.getBlackRate())
        b -= 0.1
        b = b >= 0 ? b ** 3 : 0
        snow.colormap.setBlackRate(b)
      }
      break

    case e.key == "s":
      {
        snow.init()
      }
      break


    default:
      break
  }
  snow.colormap.setBlackRate(0)
  snow.changeColor()
});
