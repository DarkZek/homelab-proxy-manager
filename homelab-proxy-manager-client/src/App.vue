<template>
  <router-view />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

if (!localStorage.getItem('token')) {
  router.push('/login');
}

</script>
