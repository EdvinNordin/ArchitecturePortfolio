<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { resetObject, cleanupThreeJS, createObject3D, Object3D } from './three'

const container = ref<HTMLCanvasElement | null>(null)
let object3d: Object3D | null = null
const sizeScaler = 100

onMounted(() => {
  if (container.value) object3d = createObject3D(container.value, '/baken.3dm', sizeScaler)
})

onUnmounted(() => {
  if (object3d) cleanupThreeJS(object3d)
})

function resetRotation() {
  if (object3d) resetObject(object3d)
}
</script>

<template>
  <canvas ref="container" class="w-full h-full"></canvas>
  <button @click="resetRotation" class="top-10 right-10 absolute">RESET 3D VIEW</button>
</template>

<style scoped></style>
