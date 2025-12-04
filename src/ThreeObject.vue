<script setup lang="ts">
import { onMounted, onUnmounted, ref, defineProps } from 'vue'
import { resetObject, cleanupThreeJS, createObject3D, Object3D } from './three'

interface Props {
  source: string
  size: number
  rotation?: [number, number, number]
}

const props = withDefaults(defineProps<Props>(), {
  rotation: () => [0, 0, 0],
})

const container = ref<HTMLCanvasElement | null>(null)
let object3d: Object3D | null = null

onMounted(() => {
  if (container.value)
    object3d = createObject3D(container.value, props.source, props.size, props.rotation)
})

onUnmounted(() => {
  if (object3d) cleanupThreeJS(object3d)
})

function resetRotation() {
  if (object3d) resetObject(object3d)
}
</script>

<template>
  <div class="relative w-full h-full">
    <h1
      @click="resetRotation"
      class="absolute top-0 right-0 font-bold py-1 px-2 m-2 rounded z-1 text-xs hover:cursor-pointer"
    >
      RESET 3D VIEW
    </h1>

    <canvas ref="container" class="w-full h-full"></canvas>
  </div>
</template>

<style scoped></style>
