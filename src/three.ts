import * as THREE from 'three'
// @ts-ignore
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader'

export class Object3D {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  object: THREE.Object3D | null = null
  canvas: HTMLCanvasElement
  startRotation: [number, number, number]
  constructor(
    canvas: HTMLCanvasElement,
    fileName: string,
    sizeScaler: number,
    rotation: [number, number, number],
  ) {
    this.canvas = canvas

    this.scene = new THREE.Scene()
    this.scene.background = null
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      100,
    )
    this.camera.position.z = 4

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true }) //
    this.renderer.setClearColor(0x000000, 0)
    //this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false)

    // loadModel now returns a Promise that resolves with the loaded Object3D
    this.loadModel(fileName, sizeScaler).then((obj) => {
      this.object = obj
      if (this.object) {
        this.scene.add(this.object)
        this.resize()
        this.object.quaternion.setFromEuler(new THREE.Euler(rotation[0], rotation[1], rotation[2]))
        this.animate()
      }
    })
    this.startRotation = rotation

    this.eventListeners()

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(2, 2, 2)
    this.scene.add(light)
  }

  animate() {
    this.renderer.render(this.scene, this.camera)
  }

  async loadModel(fileName: string, sizeScaler: number) {
    const loader = new Rhino3dmLoader()
    loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.1/')
    const object = await loader.loadAsync(fileName)
    const pivot = new THREE.Object3D()
    pivot.add(object)
    object.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
    const scaleFactor = 0.0002 * sizeScaler
    object.scale.set(scaleFactor, scaleFactor, scaleFactor)
    const box = new THREE.Box3().setFromObject(object, false)
    const center = new THREE.Vector3()
    const boxSize = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(boxSize)
    object.position.sub(center)
    return pivot
  }

  resize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false)
    this.animate()
  }

  eventListeners() {
    window.addEventListener('resize', () => this.resize())

    let mousedown = false
    window.addEventListener('mouseup', () => {
      mousedown = false
    })
    this.canvas.addEventListener('mousedown', () => {
      mousedown = true
    })
    window.addEventListener('mousemove', (event) => {
      if (mousedown && this.object) {
        const dx = event.movementX
        const dy = event.movementY
        const rotationSpeed = 0.005
        this.rotate(dx, dy, rotationSpeed)
      }
    })

    let touchPosition: { x: number; y: number } | null = null
    this.canvas.addEventListener('touchstart', (event) => {
      if (event.touches[0]) {
        event.preventDefault()
        touchPosition = { x: event.touches[0].clientX, y: event.touches[0].clientY }
      }
    })
    this.canvas.addEventListener('touchmove', (event) => {
      if (this.object && event.touches[0] && touchPosition) {
        event.preventDefault()
        const dx = event.touches[0].clientX - touchPosition.x
        const dy = event.touches[0].clientY - touchPosition.y

        const rotationSpeed = 0.005
        this.rotate(dx, dy, rotationSpeed)

        touchPosition = { x: event.touches[0].clientX, y: event.touches[0].clientY }
      }
    })
  }
  rotate(dx: number, dy: number, rotationSpeed: number) {
    if (!this.object) return

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
}

export function createObject3D(
  canvas: HTMLCanvasElement,
  fileName: string,
  sizeScaler: number,
  rotation: [number, number, number],
): Object3D {
  return new Object3D(canvas, fileName, sizeScaler, rotation)
}

export function resetObject(world: Object3D) {
  if (world && world.object) {
    world.object.rotation.set(
      world.startRotation[0],
      world.startRotation[1],
      world.startRotation[2],
    )

    world.animate()
  }
}

export function cleanupThreeJS(world: Object3D) {
  if (world.renderer) {
    world.renderer.dispose()
  }
}
