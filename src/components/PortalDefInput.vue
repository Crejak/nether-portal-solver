<script setup lang="ts">
import {onMounted, ref} from "vue";
import VectorInput from "./VectorInput.vue";
import {IPortal} from "../models/Portal.ts";

const props = defineProps<{
  modelValue: IPortal
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', portal: IPortal): void
}>();

const portal = ref<IPortal>({
  ...props.modelValue
});

function emitPortal() {
  emit('update:modelValue', portal.value);
}

onMounted(() => {
  emitPortal();
})

</script>

<template>
  <div>
    <input type="text" v-model="portal.name" @input="emitPortal">
  </div>
  <div>
    <VectorInput v-model="portal.blockBox.corner" @update:modelValue="emitPortal"></VectorInput>
  </div>
  <div>
    <VectorInput v-model="portal.blockBox.extend" @update:modelValue="emitPortal"></VectorInput>
  </div>
  <div>
    <input type="checkbox" name="-z" v-model="portal.obstructNorth" @input="emitPortal">
    <input type="checkbox" name="+x" v-model="portal.obstructEast" @input="emitPortal">
    <input type="checkbox" name="+z" v-model="portal.obstructSouth" @input="emitPortal">
    <input type="checkbox" name="-x" v-model="portal.obstructWest" @input="emitPortal">
  </div>
</template>

<style scoped>

</style>