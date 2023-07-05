<script setup lang="ts">
import {IPortal, Portal} from "../models/Portal.ts";
import PortalDefInput from "./PortalDefInput.vue";
import {computed, ref, watch} from "vue";
import {DimensionTravelType} from "../models/models.ts";
import {oneBlockBox} from "../models/Box.ts";

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
  blockBox: oneBlockBox(),
  dimensionTravelType: props.dimensionTravelType,
  obstructNorth: false,
  obstructEast: false,
  obstructSouth: false,
  obstructWest: false
});

const portal = computed(() => {
  return Portal.fromDef(portalDef.value);
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
      Block box : {{ portal.blockBox.toString() }}
    </div>
    <div>
      Block position list : {{ portal.blockPosList().toString() }}
    </div>
    <div>
      Player entry box : {{ portal.playerEntryBox.toString() }}
    </div>
    <div>
      Destination box : {{ portal.destinationBox().toString() }}
    </div>
    <div>
      Destination block box : {{ portal.destinationBlockBox().toString() }}
    </div>
    <div>
      Destination locations : {{ portal.destinationBlockPosList().toString() }}
    </div>
  </div>
</template>

<style scoped>

</style>