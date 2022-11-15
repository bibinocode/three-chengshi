import * as Three from 'three'
import gsap from 'gsap'
export default class {
  constructor() {
    const linePoints = [
      new Three.Vector3(0, 0, -3),
      new Three.Vector3(4, 3, -3),
      new Three.Vector3(9, 0, -3)
    ]
    // 创建曲线
    this.lineCurve = new Three.CatmullRomCurve3(linePoints)
    // 根据曲线创建管道
    this.geometry = new Three.TubeGeometry(this.lineCurve, 100, 0.4, 2, false)
    // 设置飞线纹理
    this.textureLoader = new Three.TextureLoader()
    this.texture = this.textureLoader.load('texture/z_112.png')
    // 因为我们利用管道制作，展开后只有半个面，所以纹理的箭头只有一半，所以我们需要设置镜像重复
    // 并且当uv展开后，x是竖着的，y是横着的。所以我们是重复y轴
    this.texture.repeat.set(1, 2)
    // 设置x轴重复正常
    this.texture.wrapS = Three.RepeatWrapping // 纹理将简单地重复
    this.texture.wrapT = Three.MirroredRepeatWrapping // 将纹理镜像重复
    this.material = new Three.MeshBasicMaterial({
      color: 0xfff000,
      map: this.texture,
      transparent: true
    })
    this.mesh = new Three.Mesh(this.geometry, this.material)
    // 动画移动只需要不断的对纹理进行偏移x轴即可
    gsap.to(this.texture.offset, {
      x: -1,
      duration: 1,
      repeat: -1,
      ease: 'none'
    })
  }
}
