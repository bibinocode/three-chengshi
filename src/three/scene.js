import * as Three from 'three'

const scene = new Three.Scene()
const cubeTextLoader = new Three.CubeTextureLoader()
const sceneMap = cubeTextLoader.load([
  'texture/1.jpg',
  'texture/2.jpg',
  'texture/3.jpg',
  'texture/4.jpg',
  'texture/5.jpg',
  'texture/6.jpg',
])

scene.background = sceneMap
scene.environment = sceneMap

export default scene