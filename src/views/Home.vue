<template>
  <Scene :eventList="eventList"></Scene>
  <BigScreen :info="dataInfo" :eventList="eventList"></BigScreen>
</template>

<script setup>
import Scene from '@/components/Scene.vue'
import BigScreen from '@/components/Bigscreen.vue'
import * as Api from '@/api/mock.js'
import gsap from 'gsap'

import { onMounted, ref } from 'vue'
const dataInfo = ref({
  event: { number: 0 },
  iot: { number: 0 },
  power: { number: 0 },
  test: { number: 0 }
})
const eventList = ref([])
const getEvent = async () => {
  const info = await Api.getInfo()
  const list = await Api.getList()
  for (let key in info) {
    dataInfo.value[key].name = info[key].name
    dataInfo.value[key].unit = info[key].unit
    gsap.to(dataInfo.value[key], {
      number: info[key].number,
      duration: 1,
      repeat: 1
    })
  }
  eventList.value = list
}


onMounted(() => {
  getEvent()
  setInterval(() => {
    getEvent()
  }, 10000)
})
</script>

<style lang="scss">

</style>