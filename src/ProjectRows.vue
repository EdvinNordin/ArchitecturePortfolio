<script setup lang="ts">
import ThreeObject from './ThreeObject.vue'
</script>

<template>
  <div class="border-2 border-black w-14/20 p-5 m-5 relative flex flex-col md:flex-row gap-5">
    <img src="/baken.png" class="block w-full lg:w-14/20" />
    <div v-if="isMobile" class="">
      <ThreeObject source="/net.3dm" :size="2" :rotation="[0.2, -0.5, 0]" />
    </div>
    <div v-else class="lg:w-6/20">
      <ThreeObject source="/net.3dm" :size="1.3" :rotation="[0.2, -0.5, 0]" />
    </div>
  </div>
</template>

<style scoped></style>
