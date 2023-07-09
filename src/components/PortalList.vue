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
  const dimensionName = props.dimensionTravelType === DimensionTravelType.NETHER_TO_OVERWORLD
    ? "Nether"
    : "Overworld";
  const key = `${dimensionName}_${incrementalId.value++}`;
  const name = `${dimensionName} ${incrementalId.value}`;
  portalCardPropMap.set(key, {
    portalKey: key,
    allPortals: props.allPortals,
    name,
    dimensionTravelType: props.dimensionTravelType
  });
}

function removePortal(key: string) {
  portalCardPropMap.delete(key)
  portalMap.delete(key);
}
</script>

<template>
  <div
      v-for="[key, portalDef] in portalCardPropMap.entries()"
      :key="key"
  >
    <PortalCard
        :dimension-travel-type="dimensionTravelType"
        :name="portalDef.name"
        :portal-key="key"
        :all-portals="allPortals"
        @input="portalMap.set(key, $event)"
        @remove="removePortal"
    >
    </PortalCard>
  </div>
  <div class="columns centered">
    <button class="add-button" @click="addPortalDef">Add</button>
  </div>
</template>

<style scoped>
.add-button {

}
</style>