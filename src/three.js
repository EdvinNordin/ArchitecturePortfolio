import * as THREE from 'three'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader'

class Object3D {
  scene
  camera
  renderer
  object
  constructor(canvas, fileName, sizeScaler) {
    this.scene = new THREE.Scene()
    this.scene.background = null
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100,
    )
    this.camera.position.z = 4

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true }) //
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

    // loadModel now returns a Promise that resolves with the loaded Object3D
    this.loadModel(fileName, sizeScaler).then((obj) => {
      this.object = obj
      if (this.object) {
        this.scene.add(this.object)
        this.animate()
      }
    })

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(2, 2, 2)
    this.scene.add(light)

    window.addEventListener('resize', this.handleResize)

    let mousedown = false
    window.addEventListener('mouseup', () => {
      mousedown = false
    })
    canvas.addEventListener('mousedown', () => {
      mousedown = true
    })
    window.addEventListener('mousemove', (event) => {
      if (mousedown) {
        const dx = event.movementX
        const dy = event.movementY
        const rotationSpeed = 0.005

        // Horizontal rotation around world's UP (feels natural)
        const qY = new THREE.Quaternion()
        qY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx * rotationSpeed)

        // Vertical rotation around camera's RIGHT (fixes upside-down problem!)
        const cameraRight = new THREE.Vector3()
        this.camera.getWorldDirection(cameraRight)
        cameraRight.cross(new THREE.Vector3(0, 1, 0)).normalize()

        const qX = new THREE.Quaternion()
        qX.setFromAxisAngle(cameraRight, dy * rotationSpeed)

        // Apply combined rotation
        this.object.quaternion.multiplyQuaternions(qY, this.object.quaternion)
        this.object.quaternion.multiplyQuaternions(qX, this.object.quaternion)
        this.animate()
      }
    })
  }

  handleResize() {
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
  }

  animate() {
    this.renderer.render(this.scene, this.camera)
    //requestAnimationFrame(this.animate.bind(this))
  }

  async loadModel(fileName, sizeScaler) {
    const loader = new Rhino3dmLoader()
    loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.1/')
    const object = await loader.loadAsync(fileName)
    const pivot = new THREE.Object3D()
    pivot.add(object)
    object.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
    const scaleFactor = 0.000002 * sizeScaler
    object.scale.set(scaleFactor, scaleFactor, scaleFactor)
    let box = new THREE.Box3().setFromObject(object, false)
    let center = new THREE.Vector3()
    let boxSize = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(boxSize)
    object.position.sub(center)
    return pivot
  }
}
export function createObject3D(canvas, fileName, sizeScaler) {
  return new Object3D(canvas, fileName, sizeScaler)
}

export function resetObject(world) {
  if (world) {
    world.object.rotation.set(0, 0, 0)
    world.animate()
  }
}

export function cleanupThreeJS() {
  if (world.renderer) {
    world.renderer.dispose()
  }
}
