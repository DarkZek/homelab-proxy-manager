<template>
    <q-btn @click="refresh" icon="refresh" label="Refresh Configs" />
    <q-btn @click="router.push('/setup/validation')" icon="refresh" label="Start Validation" />
</template>

<script lang="ts" setup>
import RestApiClient from 'src/client/RestApiClient';
import { useRouter } from 'vue-router';

const router = useRouter();

async function refresh() {
    await RestApiClient.updateProxies();
}

</script>