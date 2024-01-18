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
        v-if="part > 1 && part < 7"
        @click="back" />
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
          v-model:destination="destination" />
      </transition>
      <transition name="slideUp">
        <part-four-slide
          v-if="part === 4"
          @next="part = 5"
          :destinationType="destinationType"
          :destination="destination" />
      </transition>
      <transition name="slideUp">
        <part-five-slide
          v-if="part === 5"
          @next="part = 6"
          :domain="domain"
          v-model="supportsHttps" />
      </transition>
      <transition name="slideUp">
        <part-six-slide
          v-if="part === 6"
          @next="part = 7"
          :destination-type="destinationType"
          :port="destination.port"
          :host="destination.host"
          :forward-https="destination.portIsHttps"
          :supports-https="supportsHttps"
          :domain="domain" />
      </transition>
      <transition name="slideUp">
        <part-seven-slide
          v-if="part === 7"
          :domain="domain"
          :supports-https="supportsHttps" />
      </transition>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PartOneSlide from '../components/Wizard/PartOneSlide.vue';
import PartTwoSlide from '../components/Wizard/PartTwoSlide.vue';
import PartThreeSlide from '../components/Wizard/PartThreeSlide.vue';
import PartFourSlide from '../components/Wizard/PartFourSlide.vue';
import PartFiveSlide from '../components/Wizard/PartFiveSlide.vue';
import PartSixSlide from '../components/Wizard/PartSixSlide.vue';
import PartSevenSlide from '../components/Wizard/PartSevenSlide.vue';
import { ProxyDestinationType } from '@backend/types';

// These are loading pages that automatically progress so when we click back, we skip over them as well
const skipBack = [2, 4];

const part = ref(1);

const domain = ref('');

const destinationType = ref(ProxyDestinationType.DOCKER);

const supportsHttps = ref(false);

const destination = ref<{
  host: string | undefined,
  port: string | undefined,
  portIsHttps: boolean | undefined
}>({ host: undefined, port: undefined, portIsHttps: false });

function back() {
  part.value--;
  if (skipBack.includes(part.value) && part.value !== 0) {
    back();
  }
}

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