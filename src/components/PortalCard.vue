<script setup lang="ts">
import {IPortal, Portal} from "../models/Portal.ts";
import PortalDefInput from "./PortalDefInput.vue";
import {computed, ref, watch} from "vue";
import {DimensionTravelType, vector} from "../models/models.ts";

export interface Props {
  dimensionTravelType: DimensionTravelType,
  name: string
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'input', portal: Portal): void
}>();

const portalDef = ref<IPortal>({
  name: props.name,
  blockBox: {
    corner: vector(0, 0, 0),
    extend: vector(1, 1, 1)
  },
  dimensionTravelType: props.dimensionTravelType,
  obstructNorth: false,
  obstructEast: false,
  obstructSouth: false,
  obstructWest: false
});

const portal = computed(() => {
  return new Portal(portalDef.value);
});

watch(portal, () => {
  emit('input', portal.value);
});

</script>

<template>
  <div class="portal-card">
    <div>
      <PortalDefInput v-model="portalDef"></PortalDefInput>
    </div>
  </div>
  <div>
    <div>
      Block position list : {{ JSON.stringify(portal.blockPosList()) }}
    </div>
    <div>
      Player entry box : {{ JSON.stringify(portal.playerEntryBox()) }}
    </div>
    <div>
      Destination locations : {{ JSON.stringify(portal.destinationBlockPosList()) }}
    </div>
  </div>
</template>

<style scoped>

</style>