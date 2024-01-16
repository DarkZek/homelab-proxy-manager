<template>
    <flat-card class="q-pa-lg q-mt-lg">
        <div class="row">
            <div class="col">
                <a class="title">Debugging Steps</a>
                <br>
                <span>The error message returned by the connection system was:</span>
                <br>
                <br>
                <i class="text-negative">{{ props.message ?? 'Unknown Error' }}</i>
                <br>
                <br>
                <span class="content">This step validates that the destination is correctly configured to access traffic towards it.</span>
                <br>
                <span class="content">This requires that the port is listening for traffic and correctly configured with the HTTPS flag.</span>
                <br>
            </div>
        </div>
    </flat-card>
</template>

<script lang="ts" setup>
import FlatCard from '../FlatCard.vue';
import { defineEmits, defineModel } from 'vue';

const props = defineProps<{ domain: string, message: string }>();

</script>