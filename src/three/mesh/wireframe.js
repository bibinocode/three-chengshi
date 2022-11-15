import * as Three from 'three'

export default class {
  constructor(geometry) {
    const edges = new Three.EdgesGeometry(geometry)
    this.material = new Three.LineBasicMaterial({
      color: 0xffffff
    })
    this.geometry = edges
    this.mesh = new Three.LineSegments(this.geometry, this.material)
  }
}