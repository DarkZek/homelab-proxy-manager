<template>
    <div>
        <label class="label">{{ props.label }}</label>
        <q-select
            class="styled"
            outlined
            rounded
            v-model="model"
            :placeholder="props.placeholder"
            use-input
            :rules="props.rules"
            :loading="props.loading"
            :options="props.options"
            hide-selected
            popup-content-class="custom-select-popup"
            input-debounce="0"
            @filter="filterFn"
            :options-dense="props.optionsDense"
            fill-input>
            <template #append>
                <slot name="append" />
            </template>
        </q-select>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineModel } from 'vue';

const model = defineModel<{ label: string; value?: string | undefined; } | undefined>();

const props = defineProps<{
    label?: string,
    placeholder?: string,
    loading?: boolean,
    options?: { label: string, value: string }[],
    optionsDense?: boolean,
    disable?: boolean,
    rules?: ((val: any) => boolean | string)[]
}>()

const emits = defineEmits(['filter']);

function filterFn(val: string, update: () => void) {
    emits('filter', val);
    update();
}

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

<style lang="scss">

.custom-select-popup {
    border-radius: 25px;
    max-height: 400px;
    filter: $shadow;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);

    .q-item--active {
        background-color: rgb(241, 241, 241) !important;
        font-weight: bold;
    }
}

</style>