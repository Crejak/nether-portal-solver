<script setup lang="ts">
import {vector, IVector} from "../models/models.ts";
import {ref} from "vue";

const props = defineProps<{
  modelValue: IVector
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: IVector): void
}>();

const vec = ref(vector(props.modelValue.x, props.modelValue.y, props.modelValue.z));

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