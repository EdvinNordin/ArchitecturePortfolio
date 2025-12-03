<script setup lang="ts">
import ThreeObject from './ThreeObject.vue'
</script>
<template>
  <div class="w-full fixed pt-2 pb-2 z-10 bg-[#dbd8d4]">
    <div class="flex flex-row justify-between">
      <h1 class="text-2xl font-bold ml-5">RICHARD LÖVBY</h1>
      <h1 class="text-2xl font-bold mr-5">UMEÅ, SWEDEN</h1>
    </div>
  </div>
  <div class="h-screen p-20">
    <div class="w-full">
      <ThreeObject source="/net.3dm" :size="180" :rotation="[0.2, 0.5, 0]" />
    </div>
  </div>
</template>
<style scoped></style>
