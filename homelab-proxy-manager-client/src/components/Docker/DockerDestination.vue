<template>
    <div class="full-width col">
        <docker-container-picker v-model="dockerHost" />
        <br>
        <div class="row">
            <div class="col">
                <docker-port-picker v-model="portBind" :host="dockerHost" />
            </div>
            <div class="col q-pl-lg" style="padding-top: 12px">
                <custom-checkbox v-model="portIsHttps" label="Port is HTTPS" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineModel, defineProps } from 'vue';
import DockerContainerPicker from './DockerContainerPicker.vue';
import DockerPortPicker from './DockerPortPicker.vue';
import CustomCheckbox from '../CustomCheckbox.vue';

const dockerHost = defineModel<string | undefined>('host');

const portBind = defineModel<string | undefined>('port');

const portIsHttps = defineModel<boolean | undefined>('portIsHttps');

</script>