<script setup lang="ts">
import {ref} from "vue";
import {IVector} from "../models/Vector.ts";

const props = defineProps<{
  modelValue: IVector
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: IVector): void
}>();

const vec = ref<IVector>({
  x: props.modelValue.x,
  y: props.modelValue.y,
  z: props.modelValue.z
});

function onInput() {
  emit('update:modelValue', vec.value);
}

</script>

<template>
  <input type="number" v-model="vec.x" @input="onInput">
  <input type="number" v-model="vec.y" @input="onInput">
  <input type="number" v-model="vec.z" @input="onInput">
</template>

<style scoped>

</style>