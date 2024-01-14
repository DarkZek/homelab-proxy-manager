<template>
    <loading-slide
        :loading="loading"
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
            subtitle: 'Your domain is not accessable from the internet.',
            icon: 'o_verified'
        }" />
</template>

<script lang="ts" setup>
import LoadingSlide from './LoadingSlide.vue';
import { ref, onMounted } from 'vue';

const loading = ref(true);

onMounted(() => {
    setTimeout(() => {
        loading.value = false;
    }, 6000);
});

</script>