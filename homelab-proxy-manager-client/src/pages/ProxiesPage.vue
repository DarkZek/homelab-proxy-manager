<template>
  <q-page class="col">
    <div class="row">
      <q-space />
      <q-btn flat class="bg-white bg-text q-mb-md" no-caps label="New Proxy" icon="add" rounded @click="router.push('/proxies/new')" />
    </div>
    <div class="row">
      <div class="col">
        <proxy-view class="q-pa-sm" v-for="proxy of rows" :proxy="proxy" :key="proxy.id" @click.prevent="router.push(`/proxies/${proxy.id}`)" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ProxyStatus } from '@backend/types/ProxyStatus';
import { ProxyDestinationType } from '@backend/types/ProxyDestinationType';
import RestApiClient from '../client/RestApiClient';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ProxyView from '../components/Proxy/ProxyView.vue';

const router = useRouter();

const rows = ref();

RestApiClient.getAllProxies().then((proxies) => {
  rows.value = proxies.data.rows;
})
</script>

<style lang="scss" scoped>

.q-page {
  padding: 80px;
  max-width: 1000px;
}

.proxy-view {
  margin-bottom: 15px;
  cursor: pointer;
  transition: filter 0.1s ease-in-out;

  &:hover {
    filter: $shadow;
  }
}

</style>