<script setup lang="ts">
import PortalList from "./components/PortalList.vue";
import {DimensionTravelType} from "./models/models.ts";
import {reactive} from "vue";
import {Portal} from "./models/Portal.ts";

const portalMap = reactive(new Map<string, Portal>());

function onPortalInput(newPortalMap: Map<string, Portal>): void {
  newPortalMap.forEach((portal, key) => {
    portalMap.set(key, portal);
  })
}

</script>

<template>
  <h1>Nether Portal Solver</h1>
  <div>
    <h2>Overworld</h2>
    <PortalList :dimension-travel-type="DimensionTravelType.OVERWORLD_TO_NETHER" :all-portals="portalMap" @input="onPortalInput"></PortalList>
  </div>
  <div>
    <h2>Nether</h2>
    <PortalList :dimension-travel-type="DimensionTravelType.NETHER_TO_OVERWORLD" :all-portals="portalMap" @input="onPortalInput"></PortalList>
  </div>
</template>

<style scoped>
</style>
