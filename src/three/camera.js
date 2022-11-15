import * as Three from 'three'

const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200)
camera.position.set(0, 10, 16)

export default camera