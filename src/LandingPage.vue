<script setup lang="ts">
import ThreeObject from './ThreeObject.vue'
</script>
<template>
  <div class="w-full fixed pt-5 z-10 bg-[#dbd8d4]">
    <div class="flex flex-row justify-between mx-10">
      <h1 class="text-2xl font-bold">RICHARD LÖVBY</h1>
      <h1 class="text-2xl font-bold">UMEÅ, SWEDEN</h1>
    </div>
  </div>
  <div class="h-[50vh] md:h-screen pt-20">
    <div class="w-3/5 lg:w-3/5 h-full mx-auto">
      <ThreeObject source="/baken.3dm" :size="1" />
    </div>
  </div>
</template>
<style scoped></style>
