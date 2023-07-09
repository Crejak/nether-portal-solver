<script setup lang="ts">
import {onMounted, ref} from "vue";
import VectorInput from "./VectorInput.vue";
import {IPortal} from "../models/Portal.ts";
import {v4 as uuid} from "uuid";
import Spoiler from "./Spoiler.vue";

const props = defineProps<{
  modelValue: IPortal
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', portal: IPortal): void
}>();

const portal = ref<IPortal>({
  ...props.modelValue
});

const northId = ref(uuid().toString())
const eastId = ref(uuid().toString())
const southId = ref(uuid().toString())
const westId = ref(uuid().toString())

function emitPortal() {
  emit('update:modelValue', portal.value);
}

onMounted(() => {
  emitPortal();
})

</script>

<template>
  <h3 class="local-title line">
    <input class="title-input" type="text" v-model="portal.name" @input="emitPortal">
  </h3>
  <Spoiler :show="true" title="Definition">
    <div class="line">
      <label class="line-label label-above">Corner position</label>
      <VectorInput v-model="portal.blockBox.corner" @update:modelValue="emitPortal"></VectorInput>
    </div>
    <div class="line">
      <label class="line-label label-above">Dimension (in blocks)</label>
      <VectorInput v-model="portal.blockBox.extend" @update:modelValue="emitPortal"></VectorInput>
    </div>
    <div class="line bottom-grid">
      <div>
        <label class="line-label label-above">Sides obstructed by blocks</label>
        <div class="direction-inputs">
          <div class="direction-input input-north">
            <label class="local-label" :for="northId">North (-z)</label>
            <input :id="northId" type="checkbox" name="-z" v-model="portal.obstructNorth" @input="emitPortal">
          </div>
          <div class="direction-input input-east">
            <label class="local-label" :for="eastId">East (+x)</label>
            <input :id="eastId" type="checkbox" name="+x" v-model="portal.obstructEast" @input="emitPortal">
          </div>
          <div class="direction-input input-south">
            <label class="local-label" :for="southId">South (+z)</label>
            <input :id="southId" type="checkbox" name="+z" v-model="portal.obstructSouth" @input="emitPortal">
          </div>
          <div class="direction-input input-west">
            <label class="local-label" :for="westId">West (-x)</label>
            <input :id="westId" type="checkbox" name="-x" v-model="portal.obstructWest" @input="emitPortal">
          </div>
        </div>
      </div>
      <div>
        <label class="line-label label-above">Preview</label>
      </div>
    </div>
  </Spoiler>
</template>

<style scoped>
.local-title {
  margin: 0;
  text-align: center;
}

.title-input {
  text-align: center;
  font-size: large;
}

.bottom-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.direction-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.direction-input {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.input-north {
  grid-column: 1 / 3;
  grid-row: 1;
}

.input-east {
  grid-column: 2;
  grid-row: 2;
}

.input-south {
  grid-column: 1 / 3;
  grid-row: 3;
}

.input-west {
  grid-column: 1;
  grid-row: 2;
}
</style>