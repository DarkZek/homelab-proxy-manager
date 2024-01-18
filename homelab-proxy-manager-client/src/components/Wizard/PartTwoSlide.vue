<template>
    <div class="full-width">
        <loading-slide
            :loading="loading"
            :error="error"
            @error-clicked="errorClicked"
            :loadingTexts="{
                title: 'Validating proxy availability...',
                subtitle:'This may take a few minutes. Please wait.',
                icon: 'o_network_check'
            }"
            :successTexts="{
                title: 'Verified Availability',
                icon: 'o_verified'
            }"
            :errorTexts="{
                title: 'There was a problem...',
                subtitle: `${props.domain} is not correctly configured for proxy use.`,
                icon: 'o_error',
                buttons: ['Try again', 'Skip Validation']
            }" />

        <div class="relative full-width">
            <transition name="slideUp">
                <part-two-error-slide v-if="error" :message="errorMessage!" :domain="domain" />
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import LoadingSlide from './LoadingSlide.vue';
import { ref, onMounted, defineProps } from 'vue';
import RestApiClient from '../../client/RestApiClient';
import PartTwoErrorSlide from './PartTwoErrorSlide.vue';

const loading = ref(true);
const error = ref(false);
const errorMessage = ref<string | undefined>();

const props = defineProps<{ domain: string }>();

const emits = defineEmits(['next']);

onMounted(verify);

async function verify() {

    loading.value = true;
    error.value = false;

    // Fetch this servers identifier
    let isValid = false;
    try {
        const response = await RestApiClient.validateDomainConnection(props.domain);
        isValid = response.success;
        errorMessage.value = response.message;
    } catch (e: any) {
        window.logError(e.response.data.message);
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