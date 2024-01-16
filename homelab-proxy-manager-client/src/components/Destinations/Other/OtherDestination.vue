<template>
    <div class="full-width col">
        <custom-input
            v-model="address"
            placeholder="192.168.1.7"
            label="Remote Address"
            :rules="[val => val !== undefined || 'Please input a remote address']" />
        <br>
        <div class="row">
            <div class="col">
                <custom-input
                    v-model="port"
                    label="Port"
                    placeholder="80"
                    :rules="[val => val !== undefined || 'Please select a port']"/>
            </div>
            <div class="col q-pl-lg" style="padding-top: 12px">
                <custom-checkbox v-model="portIsHttps" label="Port is HTTPS" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineModel, defineProps } from 'vue';
import CustomInput from '../../CustomInput.vue';
import CustomCheckbox from '../../CustomCheckbox.vue';

const address = defineModel<string | undefined>('address');

const port = defineModel<string | undefined>('port');

const portIsHttps = defineModel<boolean | undefined>('portIsHttps');

</script>