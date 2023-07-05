<script setup lang="ts">

import {ref} from "vue";

const show = ref(false);

function toggle() {
  show.value = !show.value;
}

</script>

<template>
  <div v-show="!show">
    <button @click="toggle">Show</button>
  </div>
  <div v-show="show">
    <slot></slot>
    <button @click="toggle">Hide</button>
  </div>
</template>

<style scoped>

</style>