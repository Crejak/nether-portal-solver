<script setup lang="ts">
import PortalList from "./components/PortalList.vue";
import {DimensionTravelType} from "./models/models.ts";
</script>

<template>
  <h1>Nether Portal Solver</h1>
  <div>
    <h2>Overworld</h2>
    <PortalList :dimension-travel-type="DimensionTravelType.OVERWORLD_TO_NETHER"></PortalList>
  </div>
  <div>
    <h2>Nether</h2>
    <PortalList :dimension-travel-type="DimensionTravelType.NETHER_TO_OVERWORLD"></PortalList>
  </div>
</template>

<style scoped>
</style>
