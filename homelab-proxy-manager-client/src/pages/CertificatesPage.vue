<template>
  <q-page class="col">
    <div class="row">
      <q-space />
      <q-btn flat class="bg-white bg-text q-mb-md" no-caps label="Import Certificate" icon="add" rounded @click="router.push('/certificates/import')" />
    </div>
    <div class="row">
      <div class="col">
        <flat-card v-for="certificate of rows" :key="certificate.id" class="q-pa-md q-mb-md row">
          <q-icon name="autorenew" size="18px" class="q-mr-md q-ml-xs" :color="certificate.autorenew ? 'green-6' : 'red-6'">
            <q-tooltip>Auto Renewal {{ certificate.autorenew ? 'Enabled' : 'Disabled' }}</q-tooltip>
          </q-icon>
          <a>{{ certificate.domain }}</a>
          <q-space />
          <a class="q-pr-sm">Expires in {{ getDaysAway(certificate.expires) }} days</a>
        </flat-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import RestApiClient from '../client/RestApiClient';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FlatCard from '../components/FlatCard.vue';
import { Certificate } from '@backend/models/Certificates/Certificate';

const router = useRouter();

const rows = ref<Certificate[]>();

function getDaysAway(expires: Date) {
  const diff = expires.getTime() - new Date().getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

RestApiClient.getAllCertificates().then((proxies) => {
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