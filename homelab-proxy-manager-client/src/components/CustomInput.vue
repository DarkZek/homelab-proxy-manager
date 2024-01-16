<template>
    <div>
        <label class="label">{{ props.label }}</label>
        <q-input
            class="styled"
            outlined
            rounded
            v-model="model"
            :placeholder="props.placeholder"
            lazy-rules
            :rules="props.rules"/>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineModel } from 'vue';

const model = defineModel<string | number>();

const props = defineProps<{
    label?: string,
    placeholder?: string,
    rules?: ((val: any) => boolean | string)[]
}>()

</script>

<style lang="scss" scoped>

.label {
    display: block;
    padding-left: 10px;
    padding-bottom: 4px;
    color: $text;
    font-weight: bold;
    font-weight: 18px;
}

</style>