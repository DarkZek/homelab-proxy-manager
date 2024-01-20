<template>
    <q-btn @click="refresh" icon="refresh" label="Refresh Configs" />
</template>

<script lang="ts" setup>
import RestApiClient from 'src/client/RestApiClient';

async function refresh() {
    await RestApiClient.updateProxies();
}

</script>