<template>
  <q-page class="col">
    <div class="row">
      <transition appear leave-active-class="animated slideUp">
        <part-one-slide v-if="part === 1" v-model="domain" @next="part = 2" />
      </transition>
      <transition appear leave-active-class="animated slideUp">
        <part-two-slide v-if="part === 2" @next="part = 3" />
      </transition>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PartOneSlide from '../components/Wizard/PartOneSlide.vue';
import PartTwoSlide from '../components/Wizard/PartTwoSlide.vue';

const part = ref(1);

const domain = ref('');

</script>

<style scoped lang="scss">

.q-page {
  padding: 80px;
  max-width: 1000px;
}



</style>