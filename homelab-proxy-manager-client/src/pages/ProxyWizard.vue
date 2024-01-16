<template>
  <q-page class="col">
    <div class="row" style="position: relative;">
      <q-btn
        class="q-mt-md q-mr-md back-button"
        rounded
        flat
        outlined
        color="grey-8"
        label="Back"
        no-caps
        icon="o_arrow_back"
        v-if="part > 1"
        @click="part--" />
      <transition name="slideUp">
        <part-one-slide
          v-if="part === 1"
          v-model="domain"
          @next="part = 2" />
      </transition>
      <transition name="slideUp">
        <part-two-slide
          v-if="part === 2"
          @next="part = 3"
          :domain="domain" />
      </transition>
      <transition name="slideUp">
        <part-three-slide
          v-if="part === 3"
          @next="part = 4"
          v-model="destinationType"
          v-model:docker-destination="dockerDestination" />
      </transition>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PartOneSlide from '../components/Wizard/PartOneSlide.vue';
import PartTwoSlide from '../components/Wizard/PartTwoSlide.vue';
import PartThreeSlide from '../components/Wizard/PartThreeSlide.vue';
import { ProxyDestinationType } from '@backend/types/ProxyDestinationType';

const part = ref(1);

const domain = ref('');

const destinationType = ref(ProxyDestinationType.DOCKER);

const dockerDestination = ref<{
  host: string | undefined,
  port: string | undefined,
  portIsHttps: boolean | undefined
}>({ host: undefined, port: undefined, portIsHttps: false });

</script>

<style scoped lang="scss">

.q-page {
  padding: 80px;
  max-width: 1000px;
}

.back-button {
  position: absolute;
  top: -60px;
}

</style>