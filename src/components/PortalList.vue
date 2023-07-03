<script setup lang="ts">

import {reactive, watch} from "vue";
import {Portal} from "../models/Portal";
import {DimensionTravelType} from "../models/models";
import PortalCard, {Props} from "./PortalCard.vue";

const props = defineProps<{
  dimensionTravelType: DimensionTravelType
}>();

const portalDefList = reactive<Array<Props>>([]);
const portalMap = reactive<Map<number, Portal>>(new Map<number, Portal>());

watch(portalDefList, () => {
  console.log("defs", portalDefList);
})

watch(portalMap, () => {
  console.log("portals", portalMap);
});

function addPortalDef() {
  portalDefList.push({
    name: `Portal ${portalDefList.length}`,
    dimensionTravelType: props.dimensionTravelType
  });
}

</script>

<template>
  <div>
    <div
      v-for="[id, portalDef] in portalDefList.entries()"
      :key="id"
    >
      <PortalCard :dimension-travel-type="dimensionTravelType" :name="portalDef.name" @input="portalMap.set(id, $event)"></PortalCard>
    </div>
    <button @click="addPortalDef">Add</button>
  </div>
</template>

<style scoped>

</style>