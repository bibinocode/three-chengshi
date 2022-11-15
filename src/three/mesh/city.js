import * as Three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import modifyCityMaterial from '../modify/modifyCityMaterial'
import scene from '../scene'
import WireFrame from './wireframe'
export default function createCity () {
  const gltfLoader = new GLTFLoader()
  gltfLoader.load('model/city.glb', gltf => {
    gltf.scene.traverse((mesh => {
      if (mesh.type == 'Mesh') {
        const basicMaterial = new Three.MeshBasicMaterial({
          color: new Three.Color(0x0c0e6f)
        })
        mesh.material = basicMaterial
        // hooks修改
        modifyCityMaterial(mesh)
        // 如果是建筑物的话,就添加线框边缘
        if (mesh.name === 'Layerbuildings') {

          const wireFrame = new WireFrame(mesh.geometry)
          // 因为模型进行了缩放，所以对应的线框也要进行缩放
          // 并且为了线框重叠没有那种虚线感，适当的将线框调大一点
          const lineSize = mesh.scale.x * 1.0001
          wireFrame.mesh.scale.set(lineSize, lineSize, lineSize)
          scene.add(wireFrame.mesh)
        }
      }
    }))
    scene.add(gltf.scene)

  })
}