<template>
    <flat-card class="q-pa-lg q-mt-lg">
        <div class="row">
            <div class="col">
                <a class="title">Debugging Steps</a>
                <br>
                <span>The error message returned by the content was:</span>
                <br>
                <br>
                <i class="text-negative">{{ props.message ?? 'Unknown Error' }}</i>
                <br>
                <br>
                <span class="content">This step validates that the domain is correctly configured to direct traffic towards this server.</span>
                <br>
                <span class="content">This requires that the port 80 is forwarded from your router to this server, as well as that your domain registrar is configured using DNS records to send requests to your public IP address.</span>
                <br>
                <span class="content">This check is performed by performing a GET request to <a :href="`http://${ props.domain }/.proxy/identify`" target="_blank">http://{{ props.domain }}/.proxy/identify</a></span>
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