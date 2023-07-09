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
    <div>
      <label class="line-label label-above">Destinations</label>
      <ul class="line">
        <li v-for="result in analyzer.allPortalResults" class="info">
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
    <Spoiler>
      <ul>
        <li v-for="hit in analyzer.hitInfos()">
          {{ hitInfoToString(hit) }}
        </li>
      </ul>
    </Spoiler>
    <Spoiler>
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
      <div>
        Ideal portal location : {{ portal.idealPortalLocation() }}
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