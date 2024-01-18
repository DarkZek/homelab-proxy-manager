<template>
    <div class="full-width col">
        <div class="row">
            <div class="col">
                <custom-select
                    :model-value="portEntry"
                    @update:model-value="port = $event.value"
                    label="Port"
                    :options="ports"
                    placeholder="80"
                    @filter="searchFn"
                    :rules="[val => val !== undefined || 'Please select a port']"/>
            </div>
            <div class="col q-pl-lg" style="padding-top: 12px">
                <custom-checkbox v-model="portIsHttps" label="Port is HTTPS" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineModel, watch } from 'vue';
import CustomSelect from '../../CustomSelect.vue';
import CustomCheckbox from '../../CustomCheckbox.vue';
import RestApiClient from 'src/client/RestApiClient';

const port = defineModel<string | undefined>('port');
const portEntry = computed(() => {
    if (port.value === undefined) {
        return undefined;
    }
    return ports.value.find((v) => v.value === port.value) ??
        {
            label: `[Custom] ${port.value}`,
            value: port.value
        };
});

const portIsHttps = defineModel<boolean | undefined>('portIsHttps');

const search = ref('');
const portsData = ref<{
    service: string;
    port: string;
}[]>([]);

function searchFn(val: string) {
    // Dont allow selection of non-ports
    if (Number.isNaN(parseInt(val))) {
        return;
    }
    search.value = val;
    port.value = val;
}

const ports = computed(() => {
    return portsData.value.filter((v) => {
        return v.port.includes(search.value) || v.service.includes(search.value);
    }).map((v) => {
        return {
            label: `[${v.service}] ${v.port}`,
            value: v.port
        }
    });
});

RestApiClient.getLocalPorts().then((v) => {
    portsData.value = v.data;
})

</script>