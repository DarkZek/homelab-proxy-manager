<template>
  <q-page class="col">
    <div class="row" style="position: relative;">
      <transition name="slideUp">
        <part-one-slide v-if="part === 1" v-model="domain" @next="part = 2" />
      </transition>
      <transition name="slideUp">
        <part-two-slide v-if="part === 2" @next="part = 3" :domain="domain" />
      </transition>
      <transition name="slideUp">
        <part-three-slide v-if="part === 3" @next="part = 4" />
      </transition>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PartOneSlide from '../components/Wizard/PartOneSlide.vue';
import PartTwoSlide from '../components/Wizard/PartTwoSlide.vue';
import PartThreeSlide from '../components/Wizard/PartThreeSlide.vue';

const part = ref(1);

const domain = ref('');

</script>

<style scoped lang="scss">

.q-page {
  padding: 80px;
  max-width: 1000px;
}

</style>