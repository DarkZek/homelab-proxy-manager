<template>
    <custom-select
        :loading="loading"
        label="Docker Container"
        :model-value="selectedHostLabel"
        @update:model-value="setSelectedHost"
        @filter="filter = $event"
        :rules="[val => val !== undefined || 'Please select a docker container']"
        :required="true"
        :options="dockerOptions">
        <template #append>
            <a class="docker-host">{{ selectedHostLabel?.value }}</a>
            <q-btn flat round dense icon="refresh" @click.prevent="loadDockerHosts" />
        </template>
    </custom-select>
</template>

<script lang="ts" setup>
import RestApiClient from 'src/client/RestApiClient';
import { computed, ref } from 'vue';
import CustomSelect from '../../CustomSelect.vue';

// The name of the docker host that is selected
const selectedHost = defineModel<string | undefined>(undefined);

// A list of all containers on the system
const dockerContainers = ref<{name: string, id: string}[]>([]);

const loading = ref(false);

// The label used for displaying the currently selected host in the format demanded by q-select
const selectedHostLabel = computed<{ label: string, value?: string} | undefined>(() => {
    if (selectedHost.value === undefined) {
        return undefined;
    }

    return { 
        label: selectedHost.value,
        value: dockerContainers.value.find((container) => container.name === selectedHost.value)?.id
    };
});

const filter = ref('');

// Sets the selected host based on the q-select's label
function setSelectedHost(value: { label: string, value?: string} | undefined) {
    selectedHost.value = value?.label;
}

// Format the docker containers in a dropdown format
const dockerOptions = computed(() => dockerContainers.value.filter((entry) => entry.name.includes(filter.value)).map((row) => {
  return {
    label: row.name,
    value: row.id,
  };
}));

// Load options
function loadDockerHosts() {
    loading.value = true;

    RestApiClient.getDockerContainers().then((containers) => {
        dockerContainers.value = containers.data;
        loading.value = false;
    });
}
loadDockerHosts();

</script>

<style lang="scss" scoped>

.docker-host {
  font-size: 14px;
}

</style>