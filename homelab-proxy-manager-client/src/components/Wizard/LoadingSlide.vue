<template>
    <flat-card class="q-pa-lg" :loading="props.loading" :error="props.error">
        <div class="row align-items full-width">
            <div class="outer circle"></div>
            <div class="inner circle"></div>
            <div class="col text-white text q-pt-lg">
                <q-icon :name="texts.icon" size="100px" />
                <br>
                <br>
                <a class="title text-white">{{ texts.title }}</a>
                <br>
                <span class="content">{{ texts.subtitle }}</span>
                <br>
                <div v-if="props.error" class="q-mt-md">
                    <q-btn
                        :label="props.errorTexts.buttons[0]"
                        no-caps
                        rounded
                        class="styled q-mx-sm"
                        @click="emits('errorClicked', i)" />
                    <q-btn
                        v-for="i of props.errorTexts.buttons.slice(1)"
                        :key="i"
                        :label="i"
                        no-caps
                        rounded
                        flat
                        class="q-mx-sm"
                        @click="emits('errorClicked', i)" />
                </div>
            </div>
        </div>
    </flat-card>
</template>

<script lang="ts" setup>
import FlatCard from '../FlatCard.vue';
import { defineEmits, defineModel, defineProps, computed } from 'vue';

const props = defineProps<{
    loadingTexts: {
        icon: string,
        title: string,
        subtitle?: string,
    },
    successTexts: {
        icon: string,
        title: string,
        subtitle?: string,
    },
    errorTexts: {
        icon: string,
        title: string,
        subtitle?: string,
        buttons: string[]
    },
    error: boolean,
    loading: boolean,
}>()

const texts = computed(() => {
    if (props.loading) {
        return props.loadingTexts;
    } else if (props.error) {
        return props.errorTexts;
    } else {
        return props.successTexts;
    }
})

const emits = defineEmits(['errorClicked']);

</script>

<style scoped lang="scss">

.text {
    z-index: 2;
    text-align: center;
}

.flat-card {
    width: 100%;
    min-height: 300px;
    position: relative;
    background-color: #99b6e2;
    overflow: hidden;
    transition: background-color 1s ease-in-out;

    &[loading=false] {
        &[error=false] {
            background-color: #ecf8e9;

            .circle {
                background-color: rgba(70, 226, 70, 0.3);
                animation-play-state: paused;
            }
        }
        &[error=true] {
            background-color: #efdcd5;

            .circle {
                background-color: rgba(222, 74, 48, 0.3);
                animation-play-state: paused;
            }
        }
    }
}

.circle {
    border-radius: 50%;
    background-color: rgba(55, 88, 236, 0.2);
    position: absolute;
    inset: 0px;
    margin: auto;
    aspect-ratio: 1;
    animation: breathing 5.5s infinite;
    transition: background-color 1s ease-in-out;
}

.inner {
    width: 50%;
    animation-delay: 0.5s;
    animation-duration: 3s;
}

.outer {
    width: 80%;
}

@keyframes breathing {
    0% {
        scale: 1;
    }
    70% {
        scale: 1.1;
    }
    100% {
        scale: 1;
    }
}

</style>