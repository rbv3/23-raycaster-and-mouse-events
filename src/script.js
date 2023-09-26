import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/*
    Raycaster
*/
const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()

// object1.updateMatrixWorld()
// object2.updateMatrixWorld()
// object3.updateMatrixWorld()

// raycaster.set(rayOrigin, rayDirection)
// const intersect = raycaster.intersectObject(object2)
// console.log((intersect))
// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
/*
    Mouse
*/
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (_event) => {
    mouse.x = (_event.clientX / sizes.width) * 2 - 1
    mouse.y = - (_event.clientY / sizes.height) * 2 + 1
})
let clickedObj = null;
window.addEventListener('click', (_event) => {
    if(currentIntersect) {
        switch(currentIntersect.object) {
            case object1:
                toggleClickedObj(object1)
                console.log("click on 1")
                break
            case object2:
                toggleClickedObj(object2)
                console.log("click on 2")
                break
            case object3:
                toggleClickedObj(object3)
                console.log("click on 3")
                break
        }
    }
})
const toggleClickedObj = (obj) => {
    if(clickedObj === obj) {
        clickedObj = null
    } else {
        clickedObj = obj
    }
}
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate Object
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.7) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.3) * 1.5
    
    // Cast a ray
    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    for(const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }
    for(const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }
    if(clickedObj) {
        clickedObj.material.color.set('#00ff00')
    }

    if(intersects.length) {
        if(currentIntersect === null) {
            console.log("mouse enter");
        }
        currentIntersect = intersects[0]
    } else {
        if(currentIntersect) {
            console.log("mouse leave")
        }
        currentIntersect = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()