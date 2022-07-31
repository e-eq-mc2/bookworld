import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Sakura }  from  './sakura.js'
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

let book, sakura

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
    55,
    window.innerWidth / window.innerHeight,
    0.01, 
    100 
  );

	camera.position.z = 14
	camera.position.y = 1
	scene.add(camera)

  // 環境光源
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2)
  scene.add(ambientLight)

  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF)
  directionalLight.position.set(1, 50, 50)
  // シーンに追加
  scene.add(directionalLight);

  const axesHelper = new THREE.AxesHelper( 5 )
  //scene.add( axesHelper )

  const bookWidth   = 10 * (885 / 1270)
  const bookHeight  = 10 
  const albumPages = [5]
  book = new Book(albumPages, bookWidth, bookHeight)
  book.eachPage((p) => {
    scene.add( p.mesh )
  })

  const minX = -20
  const maxX =  20
  const minY = - book.height / 2
  const maxY =   book.height * 3
  const minZ = -20
  const maxZ =  camera.position.z - 5
  sakura= new Sakura(3000, minX, maxX, minY, maxY, minZ, maxX, scene)

  window.addEventListener( 'resize', onWindowResize )

  stats = new Stats();
  //document.body.appendChild( stats.dom );

  const controls = new OrbitControls( camera, renderer.domElement );
  camera.position.y += 0.3
  controls.target.y += 0.3
  controls.zoomSpeed = 0.05

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

  sakura.update(deltaT)

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
      sakura.changeColor('black')
      break
    case e.key == '1':
      sakura.changeColor('white')
      break
    case e.key == '2':
      sakura.changeColor('blue-black')
      break
    case e.key == '3':
      sakura.changeColor('aqua-black')
      break
    case e.key == '4':
      sakura.changeColor('green-black')
      break
    case e.key == '5':
      sakura.changeColor('yellow-black')
      break
    case e.key == '6':
      sakura.changeColor('red-black')
      break
    case e.key == '7':
      sakura.changeColor('rose-black')
      break
    case e.key == '8':
      sakura.changeColor('purple-black')
      break
    case e.key == 'm':
      sakura.changeColor('mix-black')

    case e.key == "W":
      {
        let b = Math.cbrt(sakura.colormap.getBlackRate())
        b += 0.1
        b = b ** 3
        sakura.colormap.setBlackRate(b)
      }
      break

    case e.key == "w":
      {

        let b = Math.cbrt(sakura.colormap.getBlackRate())
        b -= 0.1
        b = b >= 0 ? b ** 3 : 0
        sakura.colormap.setBlackRate(b)
      }
      break

    case e.key == "s":
      {
        sakura.init()
      }
      break

    case e.key == "S":
      {
        sakura.hide()
      }
      break


    case e.key == "r":
      {
        sakura.reset()
      }
      break

    default:
      break
  }
});
