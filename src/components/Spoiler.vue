<script setup lang="ts">

import {ref} from "vue";

const props = defineProps<{
  show?: boolean,
  title: string
}>()

const show = ref(props.show ?? false);

function toggle() {
  show.value = !show.value;
}

</script>

<template>
  <div v-show="!show">
    <button class="spoiler-button show-button" @click="toggle">{{ title || "Show" }}</button>
  </div>
  <div v-show="show" class="open-spoiler">
    <button class="spoiler-button hide-button" @click="toggle">{{ title || "Hide" }}</button>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

.spoiler-button {
  display: inline-block;
  width: 100%;
  background-color: rgba(1, 1, 1, .05);
  border: none;
  font-weight: bold;
  color: rgba(1, 1, 1, .6);
  cursor: pointer;
}

.show-button::before {
  content: "\0025B8";
  padding-right: 4px;
}

.hide-button::before {
  content: "\0025BE";
  padding-right: 4px;
}
</style>