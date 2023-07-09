<script setup lang="ts">
import PortalList from "./components/PortalList.vue";
import {DimensionTravelType} from "./models/models.ts";
import {reactive, ref} from "vue";
import {Portal} from "./models/Portal.ts";

const overworldPortalMap = ref(new Map<string, Portal>());
const netherPortalMap = ref(new Map<string, Portal>());

const portalMap = reactive(new Map<string, Portal>());

function updatePortalMap() {
  portalMap.clear();
  overworldPortalMap.value.forEach((value, key) => portalMap.set(key, value));
  netherPortalMap.value.forEach((value, key) => portalMap.set(key, value));
}

</script>

<template>
  <h1 class="main-title">Nether Portal Solver</h1>
  <main class="main-content">
    <div class="columns centered">
      <div class="column">
        <h2 class="column-title">Overworld</h2>
        <PortalList :dimension-travel-type="DimensionTravelType.OVERWORLD_TO_NETHER" :all-portals="portalMap"
                    @input="overworldPortalMap = $event; updatePortalMap()"></PortalList>
      </div>
      <div class="column">
        <h2 class="column-title">Nether</h2>
        <PortalList :dimension-travel-type="DimensionTravelType.NETHER_TO_OVERWORLD" :all-portals="portalMap"
                    @input="netherPortalMap = $event; updatePortalMap()"></PortalList>
      </div>
    </div>
  </main>
</template>

<style scoped>
</style>
