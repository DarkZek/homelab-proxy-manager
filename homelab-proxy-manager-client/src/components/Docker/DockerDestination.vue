<template>
    <div>
        <docker-container-picker v-model="dockerHost" />
        <br>
        <docker-port-picker v-model="portBind" :host="dockerHost" />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineModel, defineProps } from 'vue';
import RestApiClient from '../../client/RestApiClient';
import DockerContainerPicker from './DockerContainerPicker.vue';
import DockerPortPicker from './DockerPortPicker.vue';

const dockerHost = defineModel<string | unknown>('host');

const portBind = defineModel<string | undefined>('port');

</script>