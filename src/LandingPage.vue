<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { createObject3D, cleanupThreeJS, resetObject, Object3D } from './three'

const container = ref(null)

let object3d: Object3D | null = null
const sizeScaler = 180

onMounted(() => {
  if (container.value) object3d = createObject3D(container.value, '/net.3dm', sizeScaler)
})

onUnmounted(() => {
  if (object3d) cleanupThreeJS(object3d)
})

function resetRotation() {
  if (object3d) resetObject(object3d)
}
</script>
<template>
  <div class="h-screen">
    <div class="flex flex-row justify-between w-full fixed pt-2 pb-2 z-10 bg-[#dbd8d4]">
      <h1 class="text-2xl font-bold ml-5">RICHARD LÖVBY</h1>
      <h1 class="text-2xl font-bold mr-5">UMEÅ, SWEDEN</h1>
    </div>
    <div class="w-full">
      <canvas ref="container" class="w-full h-full"></canvas>
      <button @click="resetRotation()" class="top-50 right-50 absolute">RESET 3D VIEW</button>
    </div>
  </div>
</template>
<style scoped></style>
