<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import RestApiClient from 'src/client/RestApiClient';
import { useRouter } from 'vue-router';

const router = useRouter();

// Check if setup is required
RestApiClient.checkSetup().then((val) => {
  if (!val.data.userCreation) {
    if (router.currentRoute.value.path === '/setup') return;
    router.replace('/setup');
    return;
  }
  
  if (!localStorage.getItem('token')) {
    // We're not logged in and the user has already been created, so login
    router.push('/login');
  }
  
  if (!val.data.httpsCreation) {
    if (router.currentRoute.value.path === '/setup/letsencrypt') return;
    router.replace('/setup/letsencrypt');
    return;
  }
  if (!val.data.validation) {
    if (router.currentRoute.value.path === '/setup/validation') return;
    router.replace('/setup/validation');
    return;
  }
})
</script>

<style lang="scss" setup>
.q-layout {
  background-color: #fafafa;
}
</style>
