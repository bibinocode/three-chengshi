import * as Three from 'three'
import gsap from 'gsap'
import vertext from '../../shader/lightwall/vertext.glsl'
import fragment from '../../shader/lightwall/fragment.glsl'

export default class {
  constructor(radius = 5, length = 2, position = { x: 0, z: 0 }) {
    this.geometry = new Three.CylinderGeometry(radius, radius, 2, 100, 1, true)
    this.material = new Three.ShaderMaterial({
      vertexShader: vertext,
      fragmentShader: fragment,
      transparent: true,
      side: Three.DoubleSide
    })

    this.mesh = new Three.Mesh(this.geometry, this.material)
    this.mesh.position.set(position.x, 0.5, position.z)

    // 计算几何体边界
    this.mesh.geometry.computeBoundingBox()
    const { min, max } = this.mesh.geometry.boundingBox
    // 获取物体的高度差
    const uHeight = max.y - min.y
    this.material.uniforms.uHeight = {
      value: uHeight
    }
    gsap.to(this.mesh.scale, {
      x: length,
      z: length,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "none"
    })
  }
  remove () {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.geometry.dispose()
    this.material.dispose()
  }
}

