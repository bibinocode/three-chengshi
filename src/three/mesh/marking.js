import * as Three from 'three'
import camera from '../camera'

export default class {
  constructor(type = "火警", position = { x: -4, z: -1 }) {
    const textureloader = new Three.TextureLoader()
    const getChange = {
      "电力": 'texture/tag/e.png',
      "火警": 'texture/tag/fire.png',
      "治安": 'texture/tag/jingcha.png'
    }
    this.marterial = new Three.SpriteMaterial({
      map: textureloader.load(getChange[type]),
      transparent: true,
      depthTest: false,
      // blending: Three.AdditiveBlending
    })
    this.mesh = new Three.Sprite(this.marterial)
    this.geometry = this.mesh.geometry

    this.mesh.position.set(position.x, 3.5, position.z)
    this.fns = []
    // 创建射线
    this.raycaster = new Three.Raycaster()
    this.mouse = new Three.Vector2()

    // 事件监听
    window.addEventListener('click', (event) => {
      // (event.clientX / window.innerWidth) = 0-1 然后想取值 -1 - 1之间 就 * 2 - 1
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
      this.raycaster.setFromCamera(this.mouse, camera)
      // 如果碰撞到物体
      const intersects = this.raycaster.intersectObject(this.mesh)
      event.mesh = this.mesh
      if (intersects.length > 0) {
        this.fns.forEach(fn => fn(event))
      }
    })

  }
  onClick (fn) {
    this.fns.push(fn)
  }
  remove () {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.geometry.dispose()
    this.marterial.dispose()
  }
}