import renderer from './renderer'
import scene from './scene'
import camera from './camera'
import controls from './controls'

function animate (t) {
  controls.update()
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

export default animate