<script setup lang="ts">

import {reactive, ref, watch} from "vue";
import {Portal} from "../models/Portal";
import {DimensionTravelType} from "../models/models";
import PortalCard, {Props} from "./PortalCard.vue";

const props = defineProps<{
  dimensionTravelType: DimensionTravelType,
  allPortals: Map<string, Portal>
}>();

const emit = defineEmits<{
  (e: 'input', portalMap: Map<string, Portal>): void
}>();

const portalCardPropMap = reactive<Map<string, Props>>(new Map<string, Props>());
const portalMap = reactive<Map<string, Portal>>(new Map<string, Portal>());
const incrementalId = ref<number>(0);

watch(portalMap, () => {
  emit('input', portalMap);
});

function addPortalDef() {
  const key = `Portal_${props.dimensionTravelType}_${incrementalId.value++}`;
  const name = `Portal ${incrementalId.value}`;
  portalCardPropMap.set(key, {
    portalKey: key,
    allPortals: props.allPortals,
    name,
    dimensionTravelType: props.dimensionTravelType
  });
}

</script>

<template>
  <div>
    <div
      v-for="[key, portalDef] in portalCardPropMap.entries()"
      :key="key"
    >
      <PortalCard
          :dimension-travel-type="dimensionTravelType"
          :name="portalDef.name"
          :portal-key="key"
          :all-portals="allPortals"
          @input="portalMap.set(key, $event)">
      </PortalCard>
    </div>
    <button @click="addPortalDef">Add</button>
  </div>
</template>

<style scoped>

</style>