<template>
  <q-layout view="lHh Lpr lFf">
    <NavigationBar />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavigationBar from '../components/NavigationBar.vue';
import RestApiClient from 'src/client/RestApiClient';
import { useRouter } from 'vue-router';

const router = useRouter();

RestApiClient.checkSetup().then((val) => {
  if (!val.data.userCreation) {
    router.push('/setup');
    return;
  }
  if (!val.data.httpsCreation) {
    router.push('/setup/letsencrypt');
    return;
  }
  if (!val.data.validation) {
    router.push('/setup/validation');
    return;
  }
})
</script>

<style lang="scss" setup>
.q-layout {
  background-color: #fafafa;
  display: flex;
}
.q-page-container {
  width: 100%;
}
</style>
