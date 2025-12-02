<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { resetObject, cleanupThreeJS, createObject3D, Object3D } from "./three";
const container = ref<HTMLCanvasElement | null>(null);

let object3d: Object3D | null = null;
const sizeScaler = 100;

function onImageLoaded() {
  object3d = createObject3D(container.value, '/baken.3dm', sizeScaler);
}

onUnmounted(() => {
  cleanupThreeJS();
});
</script>

<template>
  <div class="border-2 border-black p-10 m-5 w-15/20 relative">
    <div class="flex flex-row justify-between ">
      <img src="/baken.png" @load="onImageLoaded" class="w-14/20 block h-auto object-contain"/>
      <canvas ref="container" class="w-5/20 "></canvas>
    </div>
    <button @click="resetObject(object3d)" class="top-10 right-10 absolute">RESET 3D VIEW</button>
  </div>
</template>

<style scoped>
</style>
