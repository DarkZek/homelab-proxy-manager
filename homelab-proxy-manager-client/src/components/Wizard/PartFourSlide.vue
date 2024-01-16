<template>
    <div class="full-width">
        <loading-slide
            :loading="loading"
            :error="error"
            @error-clicked="errorClicked"
            :loadingTexts="{
                title: 'Validating destination availability...',
                subtitle:'This may take a few minutes. Please wait.',
                icon: 'o_network_check'
            }"
            :successTexts="{
                title: 'Verified Availability',
                icon: 'o_verified'
            }"
            :errorTexts="{
                title: 'There was a problem...',
                subtitle: `Destination is not correctly configured for proxy use.`,
                icon: 'o_error',
                buttons: ['Try again', 'Skip Validation']
            }" />

        <div class="relative full-width">
            <transition name="slideUp">
                <part-four-error-slide v-if="error" :message="errorMessage" />
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import LoadingSlide from './LoadingSlide.vue';
import { ref, onMounted, defineProps } from 'vue';
import RestApiClient from '../../client/RestApiClient';
import PartFourErrorSlide from './PartFourErrorSlide.vue';
import { ProxyDestinationType } from '@backend/types/ProxyDestinationType';

const loading = ref(true);
const error = ref(false);
const errorMessage = ref<string | undefined>();

const props = defineProps<{
    destinationType: ProxyDestinationType,
    destination: {
        host: string | undefined,
        port: string | undefined,
        portIsHttps: boolean | undefined
    }
}>();

const emits = defineEmits(['next']);

onMounted(verify);

async function verify() {

    loading.value = true;
    error.value = false;

    // Fetch this servers identifier
    let isValid = false;
    try {

        const response = await RestApiClient.validateDestinationConnection({
            destinationType: props.destinationType,
            host: props.destination.host,
            port: props.destination.port,
            portIsHttps: props.destination.portIsHttps
        });
        isValid = response.data.success;
        errorMessage.value = response.data.message;
    } catch (e) {
        console.error(e);
    }

    if (isValid) {
        loading.value = false;
        error.value = false;
        setTimeout(() => emits('next'), 1500);
    } else {
        loading.value = false;
        error.value = true;
    }
}

async function errorClicked(button: string) {
    if (button === 'Skip Validation') {
        emits('next');
    } else {
        verify();
    }
}

</script>