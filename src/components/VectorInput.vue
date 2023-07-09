<script setup lang="ts">
import {ref} from "vue";
import {IVector} from "../models/Vector.ts";
import {v4 as uuid} from "uuid";

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
const xId = ref<string>(uuid().toString());
const yId = ref<string>(uuid().toString());
const zId = ref<string>(uuid().toString());

function onInput() {
  emit('update:modelValue', vec.value);
}

</script>

<template>
  <div class="container">
    <label class="local-label" :for="xId">x</label>
    <input class="number-input" :id="xId" type="number" v-model="vec.x" @input="onInput">
    <label class="local-label" :for="yId">y</label>
    <input class="number-input" :id="yId" type="number" v-model="vec.y" @input="onInput">
    <label class="local-label" :for="zId">z</label>
    <input class="number-input" :id="zId" type="number" v-model="vec.z" @input="onInput">
  </div>
</template>

<style scoped>
.number-input {
  width: 80px;
  text-align: center;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.container > * {
  margin: 0 3px;
}
</style>