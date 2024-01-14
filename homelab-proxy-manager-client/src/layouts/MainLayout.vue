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
