<template>
  <div class="scene" ref="sceneRef">
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as Three from 'three'
import scene from '@/three/scene'
import camera from '@/three/camera'
import renderer from '@/three/renderer'
import animate from '@/three/animate'
import axes from '@/three/aexHelper'
import controls from '@/three/controls'
import createCity from '@/three/mesh/city'
import gsap from 'gsap'
import Marking from '../three/mesh/marking'
import Lightwall from '../three/mesh/lightwall'
import FlylineShader from '../three/mesh/flylineShader'
import Radar from '../three/mesh/radar'
import '@/three/init'
import { watch } from 'vue'
import evnentHub from '../utils/eventBus'

const Props = defineProps(['eventList'])
const sceneRef = ref(null)
scene.add(camera)
scene.add(axes)
createCity()
onMounted(() => {
  sceneRef.value.appendChild(renderer.domElement)
  animate()
})
const objArr = []

const fnMap = {
  "火警": (position, index) => {
    const lightWall = new Lightwall(1, 2, position)
    lightWall.eventIndex = index
    scene.add(lightWall.mesh)
    objArr.push(lightWall)
  },
  "治安": (position, index) => {
    const color = new Three.Color(Math.random(), Math.random(), Math.random()).getHex()
    const flylineShader = new FlylineShader(position, color)
    flylineShader.eventIndex = index
    scene.add(flylineShader.mesh)
    objArr.push(flylineShader)
  },
  "电力": (position, index) => {
    const color = new Three.Color(Math.random(), Math.random(), Math.random()).getHex()
    const radar = new Radar(2, position, color)
    radar.eventIndex = index
    scene.add(radar.mesh)
    objArr.push(radar)
  }
}

evnentHub.on('eventToggle', (i) => {
  objArr.forEach(item => {
    if (item.eventIndex === i) {
      item.mesh.visible = true
    } else {
      item.mesh.visible = false
    }
  })
  // 相机视角锁定物体,因为用了控制器，那么就让控制器移动
  const position = { x: Props.eventList[i].position.x / 5 - 10, z: Props.eventList[i].position.y / 5 - 10 }
  // controls.target.set(position.x, 0, position.z )
  // 添加点动画
  gsap.to(controls.target, {
    duration: 1,
    x: position.x,
    y: 0,
    z: position.z
  })
})

watch(() => Props.eventList, (newValue) => {
  objArr.forEach(obj => obj.remove())
  Props.eventList.forEach((item, index) => {
    const position = { x: item.position.x / 5 - 10, z: item.position.y / 5 - 10 }
    const alarmSprite = new Marking(item.name, position)
    // 关联索引值
    alarmSprite.eventIndex = index
    alarmSprite.onClick(() => {
      // 向事件总线派发事件。
      evnentHub.emit('spriteClick', { event: item, index })
    })
    scene.add(alarmSprite.mesh)

    objArr.push(alarmSprite)
    if (fnMap[item.name]) {
      fnMap[item.name](position, index)
    }
  })
})


</script>

<style lang="scss">
.scene {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>