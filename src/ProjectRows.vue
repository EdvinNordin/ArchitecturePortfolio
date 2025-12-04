<script setup lang="ts">
import ThreeObject from './ThreeObject.vue'
</script>

<template>
  <div class="border-2 border-black p-10 m-5 w-15/20 relative">
    <div class="flex flex-row justify-between">
      <img src="/baken.png" class="w-14/20 block h-auto object-contain" />
      <div class="w-5/20">
        <ThreeObject source="/net.3dm" :size="1.3" :rotation="[0.2, -0.5, 0]" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
