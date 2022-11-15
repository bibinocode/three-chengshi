import * as Three from 'three'
import gsap from 'gsap'
import vertexShader from '../../shader/radar/vertex.glsl'
import fragmentShader from '../../shader/radar/fragment.glsl'
export default class {
  constructor(radius, position = { x: 0, z: 0 }, color = 0xff0000) {
    this.geometry = new Three.PlaneGeometry(radius, radius, 100, 100)
    this.material = new Three.ShaderMaterial({
      uniforms: {
        uColor: {
          value: new Three.Color(color)
        },
        uTime: {
          value: 0
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      side: Three.DoubleSide
    })

    this.mesh = new Three.Mesh(this.geometry, this.material)
    this.mesh.position.set(position.x, 1, position.z)
    this.mesh.rotation.x = - Math.PI / 2
    gsap.to(this.material.uniforms.uTime, {
      value: 1,
      duration: 1,
      repeat: -1,
      ease: 'none'
    })
  }
  remove () {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.geometry.dispose()
    this.material.dispose()
  }
}