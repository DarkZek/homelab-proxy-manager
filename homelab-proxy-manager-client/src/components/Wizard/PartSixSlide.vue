<template>
    <flat-card class="q-pa-lg full-width">
        <div class="row">
            <div class="col q-pr-md">
                <a class="title">Ready to go live?</a>
                <br>
                <span class="content">Setup is complete and {{ props.domain }} is ready to go live.</span>
                <q-btn
                    class="styled full-width q-mt-sm"
                    label="Go Live"
                    no-caps
                    rounded
                    :loading="loading"
                    type="submit"
                    @click="goLive" />
            </div>
        </div>
    </flat-card>
</template>

<script lang="ts" setup>
import FlatCard from '../FlatCard.vue';
import { defineEmits, ref } from 'vue';
import RestApiClient from 'src/client/RestApiClient';
import { ProxyDestinationType, ProxyStatus } from '@backend/types';

const props = defineProps<{
    domain: string,
    supportsHttps: boolean,
    forwardHttps: boolean,
    port: string,
    destinationType: ProxyDestinationType,
    host: string,
}>();
const emits = defineEmits(['next']);

const loading = ref(false);

const created = ref(false);

async function goLive() {
    loading.value = true;

    try {
        if (!created.value) {
            await RestApiClient.createProxy({
                destinationType: props.destinationType,
                name: '??',
                forwardIp: props.host ?? '127.0.0.1',
                forwardPort: props.port,
                forwardHttps: props.forwardHttps,
                domain: props.domain,
                status: ProxyStatus.ACTIVE,
                supportsHttps: props.supportsHttps
            });
        }

        created.value = true;

        await RestApiClient.updateProxies();

        emits('next');
    } catch (e: any) {
        window.logError(`Failed to create proxy: ${e.response?.data?.message ?? e.message}`)
    } finally {
        loading.value = false;
    }
}


</script>