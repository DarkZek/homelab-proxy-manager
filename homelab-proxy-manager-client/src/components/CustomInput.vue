<template>
    <div class="custom-input">
        <label class="label">{{ props.label }}</label>
        <q-input
            class="styled"
            outlined
            rounded
            :required="props.required"
            v-model="model"
            :type="props.type"
            :placeholder="props.placeholder"
            lazy-rules
            :autocomplete="props.autocomplete"
            :rules="props.rules"/>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineModel } from 'vue';

const model = defineModel<string | number>();

const props = defineProps<{
    label?: string,
    placeholder?: string,
    rules?: ((val: any) => boolean | string)[],
    autocomplete?: string,
    required?: boolean,
    type?: "number" | "textarea" | "time" | "text" | "password" | "email" | "search" | "tel" | "file" | "url" | "date" | "datetime-local"
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