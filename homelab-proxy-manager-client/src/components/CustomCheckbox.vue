<template>
    <q-checkbox class="custom-checkbox" v-model="model" :label="props.label" :color="props.color" :disable="props.disable" />
</template>

<script lang="ts" setup>
import { defineModel } from 'vue';

const model = defineModel();

const props = defineProps<{
    label?: string,
    color?: string,
    disable?: boolean,
}>();

</script>

<style scoped lang="scss">

.custom-checkbox {
    :deep(.q-checkbox__label) {
        z-index: 2;
    }

    :deep(.q-checkbox__bg) {
        width: 1em;
        height: 1em;
        border-radius: 15px;
        border: none;
        box-shadow: $shadow-4;
        text-align: center;
        border: 5px solid white;

        .fit {
            color: transparent;
        }
    }

    :deep(.q-checkbox__inner) {
        width: 2em;
        height: 2em;
        border-radius: 15px;
        outline: white 4px solid;
    }
}

</style>