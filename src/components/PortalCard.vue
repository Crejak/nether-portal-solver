<script setup lang="ts">
import {IPortal, Portal} from "../models/Portal.ts";
import PortalDefInput from "./PortalDefInput.vue";
import {computed, ref, watch} from "vue";
import {DimensionTravelType} from "../models/models.ts";
import {oneBlockBox} from "../models/Box.ts";
import Spoiler from "./Spoiler.vue";
import {Analyzer, hitInfoToString} from "../models/Analyzer.ts";

export interface Props {
  dimensionTravelType: DimensionTravelType,
  name: string,
  portalKey: string,
  allPortals: Map<string, Portal>
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'input', portal: Portal): void,
  (e: 'remove', key: string): void
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

const analyzer = ref<Analyzer<string>>(Analyzer.empty<string>());

const portal = computed(() => {
  return Portal.fromDef(portalDef.value);
});

watch(portal, () => {
  emit('input', portal.value);
});

watch(props.allPortals, () => {
  console.log("update analyzer");
  analyzer.value = Analyzer.analyze(props.allPortals, props.portalKey);
});

function onRemoveClicked() {
  emit('remove', props.portalKey);
}

</script>

<template>
  <div class="card">
    <button class="top-left-button" @click="onRemoveClicked">Remove</button>
    <PortalDefInput v-model="portalDef"></PortalDefInput>
    <Spoiler :show="true" title="Results">
    <div>
      <label class="line-label label-above">Ideal portal location</label>
      <div class="info">
        {{ portal.idealPortalLocation() }}
      </div>
      <label class="line-label label-above">Destinations</label>
      <ul class="line">
        <li class="info" v-for="result in analyzer.allPortalResults">
          <span v-if="result.length === 0">
            A new portal will be created
          </span>
          <span v-else-if="result.length === 1">
            "{{ allPortals.get(result[0])?.name }}"
          </span>
          <span v-else>
            {{ result.map(key => `"${allPortals.get(key)?.name}"`)?.join(", ") }} (undetermined)
          </span>
        </li>
      </ul>
    </div>
    </Spoiler>
    <Spoiler title="(Technical) all hit infos">
      <ul class="line">
        <li class="info" v-for="hit in analyzer.hitInfos()">
          {{ hitInfoToString(hit) }}
        </li>
      </ul>
    </Spoiler>
    <Spoiler title="(Technical) computed portal details">
        <label class="label-above line-label">Block box</label>
        <div class="info">
          {{ portal.blockBox.toString() }}
        </div>
        <label class="label-above line-label">Block position list</label>
        <div class="info">
          {{ portal.blockPosList().toString() }}
        </div>
        <label class="label-above line-label">Player entry box</label>
        <div class="info">
          {{ portal.playerEntryBox.toString() }}
        </div>
        <label class="label-above line-label">Destination box</label>
        <div class="info">
          {{ portal.destinationBox().toString() }}
        </div>
        <label class="label-above line-label">Destination block box</label>
        <div class="info">
          {{ portal.destinationBlockBox().toString() }}
        </div>
        <label class="label-above line-label">Destination locations</label>
        <div class="info">
          {{ portal.destinationBlockPosList().toString() }}
        </div>
    </Spoiler>
  </div>
</template>

<style scoped>
.top-left-button {
  position: absolute;
  right: 0;
  top: 0;
  margin: inherit;
}
</style>