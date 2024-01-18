<template>
  <error-notification />
  <router-view />
</template>

<script setup lang="ts">
import ErrorNotification from './components/ErrorNotification.vue';
</script>

<style scoped lang="scss">

body {
  background: #F4F7FA;
}

</style>
