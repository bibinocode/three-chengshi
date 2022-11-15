import * as Three from 'three'
import vertext from '../../shader/filyline/vertext.glsl'
import fragment from '../../shader/filyline/fragment.glsl'
import gsap from 'gsap'
export default class {
  constructor(position = { x: 0, z: 0 }, color = 0xfff000) {
    const linePoints = [
      new Three.Vector3(0, 0, -3),
      new Three.Vector3(position.x / 2, 3, position.z / 2),
      new Three.Vector3(position.x, 0, position.z)
    ]

    this.lineCurve = new Three.CatmullRomCurve3(linePoints)
    // 获取点
    const points = this.lineCurve.getPoints(1000)
    this.geometry = new Three.BufferGeometry().setFromPoints(points)
    // 给每个顶点设置属性
    const aSizeArray = new Float32Array(points.length)
    for (let i = 0; i < aSizeArray.length; i++) {
      aSizeArray[i] = i
    }
    this.geometry.setAttribute('aSize', new Three.BufferAttribute(aSizeArray, 1))
    this.material = new Three.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0
        },
        uColor: {
          value: new Three.Color(color)
        },
        uLength: {
          value: points.length
        }
      },
      vertexShader: vertext,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false, // 深度叠加检测关闭
      blending: Three.AdditiveBlending // 设置混合叠加
    })

    this.mesh = new Three.Points(this.geometry, this.material)
    gsap.to(this.material.uniforms.uTime, {
      value: 1000,
      duration: 3,
      repeat: -1,
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